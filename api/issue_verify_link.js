// /api/issue_verify_link.js
// Creates a Verify Link record in Supabase.
// Stores optional per-link dock_pin. If not provided, reveal endpoint will fall back to DOCK_ACCESS_PIN.
//
// Env required:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
//
// Table: verify_links columns expected:
// token (text), load_id (text nullable), usdot_on_record (text), plate_on_record (text),
// driver_phone (text), status (text), starts_at (timestamptz nullable), expires_at (timestamptz nullable),
// dock_pin (text nullable)

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

  // Supabase returns array of inserted rows when Prefer return=representation
  return Array.isArray(data) ? data[0] : data;
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

    // Optional: per-link dock PIN
    const dock_pin_digits = onlyDigits(body.dock_pin).slice(0, 6);
    const dock_pin =
      dock_pin_digits.length >= 4 ? dock_pin_digits : null;

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
      driver_phone: driver_phone_digits, // store digits only; UI formats
      status: "active",
      starts_at,
      expires_at,
      dock_pin, // nullable
    };

    const inserted = await sbInsertVerifyLink(row);

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

    // Two URL formats (both useful):
    const verify_hash = `${origin}/#/verify/${token}`;
    const verify_public = `${origin}/v.html?t=${token}`;

    return json(res, 200, {
      ok: true,
      token,
      load_id,
      status: inserted?.status || "active",
      starts_at: inserted?.starts_at || starts_at,
      expires_at: inserted?.expires_at || expires_at,
      verify_url: verify_public,       // keep your current “v.html” flow
      verify_hash_url: verify_hash,    // backup
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
