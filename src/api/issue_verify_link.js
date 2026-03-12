// /api/issue_verify_link.js
// Creates a Verify Link record in Supabase.
// If dock_email is provided, also sends the dock an automatic email via Resend.
// Also handles broker control levers:
// - reissue
// - lock
// - clear
// - attempts

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
    Prefer: "return=representation",
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
    body: JSON.stringify(row),
  });

  const data = await safeJsonResponse(res);

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

async function sbFetchOneByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders(),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load verify link.");
  return Array.isArray(data) ? data[0] || null : null;
}

async function sbFetchAttemptsByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_checks` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&order=created_at.desc`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders(),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load attempts.");
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
    body: JSON.stringify(patch),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to update verify link.");
  return Array.isArray(data) ? data[0] || null : data;
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
  const qrUrl = buildQrUrl(verifyUrl);

  const text = [
    "AdbS TRUCK-DRIVER VERIFICATION",
    "",
    loadId ? `Load ID: ${loadId}` : null,
    "",
    "AdbS SmartLink:",
    verifyUrl,
    "",
    "OR",
    "AdbS QR Code:",
    qrUrl || "(QR unavailable)",
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

      <div style="margin:14px 0 8px; font-weight:800;">AdbS SmartLink</div>
      <div style="margin-bottom:16px;">
        <a href="${verifyUrl}" style="font-size:16px; font-weight:700; word-break:break-all;">${verifyUrl}</a>
      </div>

      <div style="display:flex; align-items:center; gap:12px; margin:10px 0 14px;">
        <div style="flex:1; height:1px; background:#d8dee8;"></div>
        <div style="font-size:12px; color:#5a6472; font-weight:800; letter-spacing:0.12em;">OR</div>
        <div style="flex:1; height:1px; background:#d8dee8;"></div>
      </div>

      <div style="margin:0 0 8px; font-weight:800;">AdbS QR Code</div>
      <div style="margin-bottom:16px;">
        <img
          src="${qrUrl}"
          alt="AdbS QR Code"
          width="260"
          height="260"
          style="display:block; background:#ffffff; padding:12px; border:1px solid #d8dee8; border-radius:12px;"
        />
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
    return {
      ok: true,
      token,
      attempts,
    };
  }

  if (action === "lock") {
    const updated = await sbPatchLinkById(link.id, {
      status: "locked",
    });

    return {
      ok: true,
      action: "lock",
      token,
      status: updated?.status || "locked",
    };
  }

  if (action === "clear") {
    const updated = await sbPatchLinkById(link.id, {
      status: "cleared",
    });

    return {
      ok: true,
      action: "clear",
      token,
      status: updated?.status || "cleared",
    };
  }

  if (action === "reissue") {
    const load_id = String(link.load_id || "").trim() || null;
    const usdot_on_record = onlyDigits(link.usdot_on_record || "");
    const plate_on_record = toUpper(link.plate_on_record || "").trim();
    const driver_phone = String(link.driver_phone || "").trim();
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
    };

    const inserted = await sbInsertVerifyLink(row);

    await sbPatchLinkById(link.id, {
      status: "reissued",
    });

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

    const verify_public = `${origin}/v.html?t=${newToken}`;

    let email_status = null;
    let email_error = null;

    if (dock_email) {
      try {
        await sendDockEmail({
          to: dock_email,
          loadId: load_id,
          verifyUrl: verify_public,
          expiresAt: inserted?.expires_at || link.expires_at || null,
        });
        email_status = "sent";
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
    if (onlyDigits(driver_phone_digits).length !== 10) {
      return json(res, 400, { ok: false, error: "Enter Driver Phone (10 digits)." });
    }

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
