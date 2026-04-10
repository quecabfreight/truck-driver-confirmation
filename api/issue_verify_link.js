import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function safe(v) {
  return String(v ?? "").trim();
}

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhone(v) {
  const d = onlyDigits(v).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);

  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function upper(v) {
  return safe(v).toUpperCase();
}

function makeToken() {
  return crypto.randomBytes(18).toString("base64url");
}

function getOrigin(req) {
  const proto = safe(req.headers["x-forwarded-proto"]) || "https";
  const host = safe(req.headers["x-forwarded-host"]) || safe(req.headers.host);
  return `${proto}://${host}`;
}

function buildVerifyUrl(req, token) {
  return `${getOrigin(req)}/v.html?t=${token}&cv=4`;
}

function buildEmailHtml({ loadId, verifyUrl, driverPhone, usdot, plate, expiresAt }) {
  const expiresText = expiresAt
    ? new Date(expiresAt).toLocaleString()
    : "No Expire";

  return `
    <div style="margin:0;padding:0;background:#0b0f14;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:720px;margin:0 auto;padding:28px 20px;">
        <div style="background:#121923;border:1px solid rgba(255,255,255,0.12);border-radius:18px;padding:24px;">
          <div style="font-size:28px;font-weight:900;letter-spacing:.02em;margin-bottom:8px;">
            AdbS TRUCK-DRIVER VERIFICATION
          </div>

          <div style="font-size:15px;line-height:1.6;color:#d5deea;margin-bottom:18px;">
            Verification happens before freight moves.
          </div>

          <div style="background:#0d1420;border:1px solid rgba(255,255,255,0.10);border-radius:14px;padding:16px 18px;margin-bottom:18px;">
            <div style="margin-bottom:8px;"><strong>Load ID:</strong> ${loadId || "(not provided)"}</div>
            <div style="margin-bottom:8px;"><strong>Driver Phone:</strong> ${driverPhone || "(not provided)"}</div>
            <div style="margin-bottom:8px;"><strong>Assigned USDOT#:</strong> ${usdot || "(not provided)"}</div>
            <div style="margin-bottom:8px;"><strong>Assigned Plate:</strong> ${plate || "(not provided)"}</div>
            <div><strong>Expires:</strong> ${expiresText}</div>
          </div>

          <div style="margin-bottom:18px;font-size:15px;line-height:1.6;color:#e8eef7;">
            Open the AdbS Verify Link at the dock, enter the USDOT# and plate exactly as shown on the truck,
            and confirm the driver answers their phone before loading.
          </div>

          <div style="margin:18px 0 22px;">
            <a href="${verifyUrl}"
               style="display:inline-block;background:#1f6feb;color:#ffffff;text-decoration:none;font-weight:900;
                      padding:14px 18px;border-radius:12px;">
              Open AdbS Verify Link
            </a>
          </div>

          <div style="font-size:14px;line-height:1.6;color:#b9c5d3;word-break:break-all;">
            <strong>Direct Link:</strong><br/>
            <a href="${verifyUrl}" style="color:#7db6ff;">${verifyUrl}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function sendDockEmail({ to, loadId, verifyUrl, driverPhone, usdot, plate, expiresAt }) {
  if (!safe(to)) {
    return { email_status: "not_sent", email_error: "No dock email provided." };
  }

  const from = safe(process.env.ADBS_EMAIL_FROM);
  if (!from) {
    return { email_status: "failed", email_error: "Missing ADBS_EMAIL_FROM." };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: safe(to),
      subject: `Truck-Driver Verification Required — ${loadId || "Load"}`,
      html: buildEmailHtml({
        loadId,
        verifyUrl,
        driverPhone,
        usdot,
        plate,
        expiresAt
      })
    });

    if (result?.error) {
      return {
        email_status: "failed",
        email_error: result.error.message || "Unknown Resend error."
      };
    }

    return {
      email_status: "sent",
      email_error: ""
    };
  } catch (err) {
    return {
      email_status: "failed",
      email_error: err?.message || "Unknown send failure."
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const loadId = safe(body.load_id);
    const dockEmail = safe(body.dock_email).toLowerCase();
    const carrierCompany = safe(body.carrier_company);
    const dispatchContact = safe(body.dispatch_contact);
    const dispatchPhone = formatPhone(body.dispatch_phone);
    const driverPhone = formatPhone(body.driver_phone);
    const usdot = onlyDigits(body.usdot_on_record);
    const plate = upper(body.plate_on_record);
    const dockPin = safe(body.dock_pin);

    const startsAt = safe(body.starts_at) || new Date().toISOString();
    const expiresAt = safe(body.expires_at) || null;

    if (!driverPhone) {
      return json(res, 400, { ok: false, error: "Driver phone is required." });
    }

    if (!usdot) {
      return json(res, 400, { ok: false, error: "USDOT# is required." });
    }

    if (!plate) {
      return json(res, 400, { ok: false, error: "Plate is required." });
    }

    const token = makeToken();
    const verifyUrl = buildVerifyUrl(req, token);

    const insertPayload = {
      token,
      load_id: loadId || null,
      dock_email: dockEmail || null,
      carrier_company: carrierCompany || null,
      dispatch_contact: dispatchContact || null,
      dispatch_phone: dispatchPhone || null,
      driver_phone: driverPhone || null,
      usdot_on_record: usdot,
      plate_on_record: plate,
      dock_pin: dockPin || null,
      starts_at: startsAt,
      expires_at: expiresAt,
      status: "active"
    };

    const { data, error } = await supabase
      .from("verify_links")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      return json(res, 500, { ok: false, error: error.message || "Could not create verification." });
    }

    const emailResult = await sendDockEmail({
      to: dockEmail,
      loadId,
      verifyUrl,
      driverPhone,
      usdot,
      plate,
      expiresAt
    });

    return json(res, 200, {
      ok: true,
      token,
      verification_id: token,
      verify_url: verifyUrl,
      status: data?.status || "active",
      expires_at: data?.expires_at || expiresAt,
      email_status: emailResult.email_status,
      email_error: emailResult.email_error
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
