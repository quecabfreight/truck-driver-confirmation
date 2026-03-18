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

function buildQrUrl(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(clean)}`;
}

function formatPhoneHyphen(s) {
  const d = String(s || "").replace(/\D/g, "").slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function formatDisplayDate(value) {
  if (!value) return "No Expire";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

async function safeJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function sbHeaders() {
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
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
    headers: sbHeaders(),
    body: JSON.stringify(row)
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Supabase insert failed (${res.status})`;
    throw new Error(msg);
  }

  return Array.isArray(data) ? data[0] : data;
}

async function sbFetchOneByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders()
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to load verify link.");
  }

  return Array.isArray(data) ? data[0] || null : null;
}

async function sbFetchAttemptsByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_checks` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&order=checked_at.desc`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders()
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to load attempts.");
  }

  return Array.isArray(data) ? data : [];
}

async function sbPatchLinkById(id, patch) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?id=eq.${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify(patch)
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to update verify link.");
  }

  return Array.isArray(data) ? data[0] || null : data;
}

async function sendDockEmail({
  to,
  loadId,
  verifyUrl,
  expiresAt
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ADBS_EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const subject = `Truck-Driver Verification Required${loadId ? ` — ${loadId}` : ""}`;
  const qrUrl = buildQrUrl(verifyUrl);

  const html = `
    <div style="margin:0; padding:24px 0; background:#f3f6fb; font-family:Arial, Helvetica, sans-serif; color:#111;">
      <div style="max-width:720px; margin:0 auto; background:#ffffff; border:1px solid #d8dee8; border-radius:18px; overflow:hidden;">
        <div style="background:linear-gradient(135deg, #1b2430, #2f3c4d); color:#ffffff; padding:18px 22px;">
          <div style="font-size:12px; letter-spacing:0.12em; font-weight:800; text-transform:uppercase; opacity:0.9;">QueCab AdbS</div>
          <div style="font-size:24px; font-weight:800; margin-top:6px;">Truck-Driver Verification Required</div>
        </div>

        <div style="padding:22px;">
          ${loadId ? `<div style="margin-bottom:14px; font-size:15px;"><span style="color:#4b5563; font-weight:700;">Load ID:</span><span style="color:#111827; font-weight:800;"> ${loadId}</span></div>` : ""}

          <div style="margin:14px 0 8px; font-weight:800; font-size:16px; color:#111827;">AdbS SmartLink</div>
          <div style="margin-bottom:16px; padding:14px; background:#f8fafc; border:1px solid #d8dee8; border-radius:12px;">
            <a href="${verifyUrl}" style="font-size:16px; font-weight:700; word-break:break-all; color:#0b57d0; text-decoration:none;">${verifyUrl}</a>
          </div>

          <div style="display:flex; align-items:center; gap:12px; margin:14px 0 18px;">
            <div style="flex:1; height:1px; background:#d8dee8;"></div>
            <div style="font-size:12px; color:#5a6472; font-weight:800; letter-spacing:0.12em;">OR</div>
            <div style="flex:1; height:1px; background:#d8dee8;"></div>
          </div>

          <div style="margin:0 0 8px; font-weight:800; font-size:16px; color:#111827;">AdbS QR Code</div>
          <div style="margin-bottom:18px; padding:18px; background:#f8fafc; border:1px solid #d8dee8; border-radius:12px; text-align:center;">
            <img src="${qrUrl}" alt="AdbS QR Code" width="260" height="260" style="display:inline-block; background:#ffffff; padding:12px; border:1px solid #d8dee8; border-radius:12px;" />
            <div style="margin-top:10px; color:#5a6472; font-size:13px;">Same destination as the AdbS SmartLink.</div>
          </div>

          <div style="font-weight:800; margin-bottom:6px; color:#111827;">Dock Instruction</div>
          <div style="margin-bottom:10px; color:#334155; line-height:1.55;">When the truck arrives, open the link above and complete verification before releasing the load.</div>
          <div style="margin-bottom:16px; color:#334155; line-height:1.55;">Enter the DOT and plate shown on the truck, then call the driver using the link.</div>

          <div style="margin-bottom:18px; font-size:14px;">
            <span style="color:#4b5563; font-weight:700;">Expires:</span>
            <span style="color:#111827; font-weight:800;"> ${formatDisplayDate(expiresAt)}</span>
          </div>
        </div>

        <div style="padding:14px 22px; border-top:1px solid #e5e7eb; background:#fafbfd; color:#6b7280; font-size:12px; line-height:1.45;">
          QueCab AdbS<br/>
          Developed by Omnimobile Inc. for QueCab Inc.
        </div>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html
    })
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Resend send failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

async function handleManageAction(req, body) {
  const action = String(body.action || "").trim().toLowerCase();
  const token = String(body.token || "").trim();

  if (!token) throw new Error("Missing token.");
  if (!action) throw new Error("Missing action.");

  const link = await sbFetchOneByToken(token);
  if (!link) throw new Error("Verification link not found.");

  if (action === "attempts") {
    const attempts = await sbFetchAttemptsByToken(token);
    return { ok: true, token, attempts };
  }

  if (action === "lock") {
    const updated = await sbPatchLinkById(link.id, { status: "locked" });
    return { ok: true, action: "lock", token, status: updated?.status || "locked" };
  }

  if (action === "clear") {
    const updated = await sbPatchLinkById(link.id, { status: "cleared" });
    return { ok: true, action: "clear", token, status: updated?.status || "cleared" };
  }

  if (action === "reissue") {
    const load_id = String(link.load_id || "").trim() || null;
    const usdot_on_record = onlyDigits(link.usdot_on_record || "");
    const plate_on_record = toUpper(link.plate_on_record || "").trim();
    const driver_phone = formatPhoneHyphen(link.driver_phone || "");
    const dock_pin = String(link.dock_pin || "").trim() || null;
    const dock_email = String(body.dock_email || "").trim().toLowerCase() || null;

    const newToken = tokenBase64Url(18);

    const row = {
      token: newToken,
      load_id,
      usdot_on_record,
      plate_on_record,
      driver_phone,
      status: "active",
      starts_at: new Date().toISOString(),
      expires_at: link.expires_at || null,
      dock_pin,
      carrier_company: String(link.carrier_company || "").trim() || null,
      dispatch_contact: String(link.dispatch_contact || "").trim() || null,
      dispatch_phone: formatPhoneHyphen(link.dispatch_phone || "") || null
    };

    const inserted = await sbInsertVerifyLink(row);
    await sbPatchLinkById(link.id, { status: "reissued" });

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

    const verify_public = `${origin}/v.html?t=${newToken}&cv=4`;
    let email_status = null;
    let email_error = null;
    let email_debug = null;

    if (dock_email) {
      try {
        const sendResult = await sendDockEmail({
          to: dock_email,
          loadId: load_id,
          verifyUrl: verify_public,
          expiresAt: inserted?.expires_at || link.expires_at || null
        });
        email_status = "sent";
        email_debug = sendResult;
      } catch (e) {
        email_status = "failed";
        email_error = String(e?.message || "Email send failed");
      }
    }

    return {
      ok: true,
      action: "reissue",
      old_token: token,
      new_token: newToken,
      verify_url: verify_public,
      email_status,
      email_error,
      email_debug
    };
  }

  throw new Error("Unknown action.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    if (body.action) {
      const out = await handleManageAction(req, body);
      return json(res, 200, out);
    }

    const load_id = String(body.load_id || "").trim() || null;
    const usdot_on_record = onlyDigits(body.usdot_on_record);
    const plate_on_record = toUpper(body.plate_on_record).trim();
    const driver_phone_digits = onlyDigits(body.driver_phone);
    const driver_phone = formatPhoneHyphen(driver_phone_digits);
    const dock_email = String(body.dock_email || "").trim().toLowerCase() || null;
    const dock_pin_digits = onlyDigits(body.dock_pin).slice(0, 6);
    const dock_pin = dock_pin_digits.length >= 4 ? dock_pin_digits : null;

    const starts_at = body.starts_at ? String(body.starts_at) : new Date().toISOString();
    const expires_at =
      body.expires_at === null || body.expires_at === ""
        ? null
        : body.expires_at
        ? String(body.expires_at)
        : null;

    if (!usdot_on_record) return json(res, 400, { ok: false, error: "Enter USDOT# (digits)." });
    if (!plate_on_record) return json(res, 400, { ok: false, error: "Enter Plate." });
    if (driver_phone_digits.length !== 10) return json(res, 400, { ok: false, error: "Enter Driver Phone (10 digits)." });

    const token = tokenBase64Url(18);

    const row = {
      token,
      load_id,
      usdot_on_record,
      plate_on_record,
      driver_phone,
      status: "active",
      starts_at,
      expires_at,
      dock_pin,
      carrier_company: String(body.carrier_company || "").trim() || null,
      dispatch_contact: String(body.dispatch_contact || "").trim() || null,
      dispatch_phone: formatPhoneHyphen(body.dispatch_phone || "") || null
    };

    const inserted = await sbInsertVerifyLink(row);

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

    const verify_hash = `${origin}/#/verify/${token}`;
    const verify_public = `${origin}/v.html?t=${token}&cv=4`;
    let email_status = null;
    let email_error = null;
    let email_debug = null;

    if (dock_email) {
      try {
        const sendResult = await sendDockEmail({
          to: dock_email,
          loadId: load_id,
          verifyUrl: verify_public,
          expiresAt: inserted?.expires_at || expires_at || null
        });
        email_status = "sent";
        email_debug = sendResult;
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
      email_debug
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
