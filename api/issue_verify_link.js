// /api/issue_verify_link.js
// Creates a Verify Link record in Supabase.
// If dock_email is provided, also sends the dock an automatic email via Resend.

import crypto from "crypto";

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpper(s) {
  return String(s || "").toUpperCase();
}

function tokenBase64Url(bytes = 18) {
  return crypto.randomBytes(bytes).toString("base64url");
}

async function sbInsertVerifyLink(row) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const url = `${SUPABASE_URL}/rest/v1/verify_links`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Supabase insert failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return Array.isArray(data) ? data[0] : data;
}

async function sendDockEmail({
  to,
  loadId,
  verifyUrl,
  expiresAt,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ADBS_EMAIL_FROM || "QueCab AdbS <verify@quecabadbs.com>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const subject = `Truck-Driver Verification Required${loadId ? ` — ${loadId}` : ""}`;

  const text = [
    "AdbS TRUCK-DRIVER VERIFICATION",
    "",
    loadId ? `Load ID: ${loadId}` : null,
    "",
    "OPEN AT DOCK:",
    verifyUrl,
    "",
    "Dock Instruction:",
    "When the truck arrives, open the link above and complete verification before releasing the load.",
    "Enter the DOT and plate shown on the truck, then call the driver using the link.",
    "",
    expiresAt ? `Expires: ${expiresAt}` : "Expires: No Expire",
    "",
    "QueCab AdbS",
    "Developed by Omnimobile Inc. for QueCab Inc.",
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#111; line-height:1.45;">
      <div style="font-size:20px; font-weight:800; margin-bottom:12px;">AdbS TRUCK-DRIVER VERIFICATION</div>
      ${loadId ? `<div style="margin-bottom:10px;"><b>Load ID:</b> ${loadId}</div>` : ""}
      <div style="margin:14px 0 8px; font-weight:800;">OPEN AT DOCK:</div>
      <div style="margin-bottom:16px;">
        <a href="${verifyUrl}" style="font-size:16px; font-weight:700;">${verifyUrl}</a>
      </div>
      <div style="font-weight:800; margin-bottom:6px;">Dock Instruction:</div>
      <div style="margin-bottom:10px;">
        When the truck arrives, open the link above and complete verification before releasing the load.
      </div>
      <div style="margin-bottom:14px;">
        Enter the DOT and plate shown on the truck, then call the driver using the link.
      </div>
      <div style="margin-bottom:14px;">
        <b>Expires:</b> ${expiresAt || "No Expire"}
      </div>
      <div style="color:#444; font-size:12px;">
        QueCab AdbS<br/>
        Developed by Omnimobile Inc. for QueCab Inc.
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  const body = await res.text();
  let data = null;
  try {
    data = JSON.parse(body);
  } catch {
    data = { raw: body };
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Resend send failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const load_id = String(body.load_id || "").trim() || null;

    const usdot_on_record = onlyDigits(body.usdot_on_record);
    const plate_on_record = toUpper(body.plate_on_record).trim();
    const driver_phone_digits = onlyDigits(body.driver_phone);
    const driver_phone = driver_phone_digits || "";

    const dock_email = String(body.dock_email || "").trim().toLowerCase() || null;

    const dock_pin_digits = onlyDigits(body.dock_pin).slice(0, 6);
    const dock_pin = dock_pin_digits.length >= 4 ? dock_pin_digits : null;

    const starts_at = body.starts_at ? String(body.starts_at) : null;
    const expires_at =
      body.expires_at === null || body.expires_at === ""
        ? null
        : body.expires_at
        ? String(body.expires_at)
        : null;

    if (!usdot_on_record) return json(res, 400, { ok: false, error: "Enter USDOT# (digits)." });
    if (!plate_on_record) return json(res, 400, { ok: false, error: "Enter Plate." });
    if (onlyDigits(driver_phone).length !== 10) return json(res, 400, { ok: false, error: "Enter Driver Phone (10 digits)." });

    const token = tokenBase64Url(18);

    const row = {
      token,
      load_id,
      usdot_on_record,
      plate_on_record,
      driver_phone: driver_phone_digits,
      status: "active",
      starts_at,
      expires_at,
      dock_pin,
    };

    const inserted = await sbInsertVerifyLink(row);

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

    const verify_hash = `${origin}/#/verify/${token}`;
    const verify_public = `${origin}/v.html?t=${token}`;

    let email_status = null;
    let email_error = null;

    if (dock_email) {
      try {
        await sendDockEmail({
          to: dock_email,
          loadId: load_id,
          verifyUrl: verify_public,
          expiresAt: inserted?.expires_at || expires_at || null,
        });
        email_status = "sent";
      } catch (e) {
        email_status = "failed";
        email_error = String(e?.message || "Email send failed");
      }
    }

    return json(res, 200, {
      ok: true,
      token,
      load_id,
      status: inserted?.status || "active",
      starts_at: inserted?.starts_at || starts_at,
      expires_at: inserted?.expires_at || expires_at,
      verify_url: verify_public,
      verify_hash_url: verify_hash,
      dock_email: dock_email || null,
      email_status,
      email_error,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}

