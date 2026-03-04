// /api/issue_verify_link.js
// Creates a verify link row in Supabase.
// Stores issuer_email + alert_email so silent alerts know who to notify.

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase().trim();
}

function toIsoOrNull(v) {
  const s = String(v || "").trim();
  if (!s) return null;
  // Accept both "YYYY-MM-DDTHH:mm" and ISO; Date will normalize
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { ok: false, error: "Server missing Supabase env vars." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body." });
  }

  const load_id = String(body.load_id || "").trim() || null;

  const usdot_digits = onlyDigits(body.usdot_on_record).slice(0, 20);
  const plate_upper = toUpperClean(body.plate_on_record).slice(0, 20);
  const phone_digits = onlyDigits(body.driver_phone).slice(0, 10);

  const issuer_email = String(body.issuer_email || "").trim().toLowerCase() || null;
  const alert_email = String(body.alert_email || "").trim().toLowerCase() || issuer_email || null;

  // starts/expires:
  // - If expires_at is explicitly null => No Expire
  // - If missing, server can still accept but we prefer it set
  const starts_at_iso = toIsoOrNull(body.starts_at) || new Date().toISOString();
  const expires_at_iso = (body.expires_at === null) ? null : (toIsoOrNull(body.expires_at) || null);

  // Per-load dock PIN optional (you already added dock_pin column)
  // If not provided, we allow NULL and fall back to master DOCK_ACCESS_PIN at reveal-time
  const dock_pin = body.dock_pin ? String(body.dock_pin).replace(/\D+/g, "").slice(0, 6) : null;

  if (!usdot_digits) return json(res, 400, { ok: false, error: "Enter USDOT# (digits)." });
  if (!plate_upper) return json(res, 400, { ok: false, error: "Enter Plate." });
  if (phone_digits.length !== 10) return json(res, 400, { ok: false, error: "Enter Driver Phone (10 digits)." });

  // Token (simple, URL-safe). Keep it stable length.
  const token = (() => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 28; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  })();

  const insert = {
    token,
    load_id,
    usdot_on_record: usdot_digits,
    plate_on_record: plate_upper,
    driver_phone: phone_digits,
    starts_at: starts_at_iso,
    expires_at: expires_at_iso,
    status: "active",
    issuer_email,
    alert_email,
    failed_attempts: 0,
    alert_sent: false,
    flagged_at: null,
    dock_pin,
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/verify_links`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(insert),
    });

    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      const msg = data?.message || data?.error || `Supabase insert failed (${r.status}).`;
      return json(res, 500, { ok: false, error: msg, details: data });
    }

    const row = Array.isArray(data) ? data[0] : data;

    const verify_url = `https://quecabadbs.com/#/verify/${token}`;

    return json(res, 200, {
      ok: true,
      token,
      verify_url,
      expires_at: row?.expires_at ?? expires_at_iso,
      link: row || insert,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Network error creating verify link." });
  }
}
