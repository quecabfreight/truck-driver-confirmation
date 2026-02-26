// /src/api/issue_verify_link.js
// Issues a verify link and stores it in Supabase.
// Returns a phone/email-safe URL that does NOT rely on "#/..." (because some email clients strip fragments).

import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpper(s) {
  return String(s || "").trim().toUpperCase();
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function makeToken(len = 24) {
  // URL-safe random token
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  const buf = new Uint32Array(len);
  crypto.getRandomValues(buf);
  for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
  return out;
}

function getBaseUrl(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").toString();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString();
  return `${proto}://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return json(res, 500, { ok: false, error: "Server missing Supabase env vars." });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const body = req.body || {};
    const load_id = (body.load_id ?? null) === "" ? null : (body.load_id ?? null);

    const usdot_on_record = onlyDigits(body.usdot_on_record);
    const plate_on_record = toUpper(body.plate_on_record);
    const driver_phone_digits = onlyDigits(body.driver_phone);

    const starts_at = body.starts_at || null;
    const expires_at = body.expires_at ?? null; // allow null for No Expire

    if (!usdot_on_record) return json(res, 400, { ok: false, error: "Missing usdot_on_record (digits)." });
    if (!plate_on_record) return json(res, 400, { ok: false, error: "Missing plate_on_record." });
    if (driver_phone_digits.length !== 10) return json(res, 400, { ok: false, error: "Driver phone must be 10 digits." });
    if (!starts_at) return json(res, 400, { ok: false, error: "Missing starts_at." });

    const token = makeToken(28);

    const insertRow = {
      token,
      load_id,
      usdot_on_record,
      plate_on_record,
      driver_phone: formatPhoneHyphen(driver_phone_digits),
      status: "active",
      starts_at,
      expires_at,
    };

    const { error } = await sb.from("verify_links").insert(insertRow);
    if (error) {
      return json(res, 500, { ok: false, error: error.message || "Supabase insert failed." });
    }

    const base = getBaseUrl(req);

    // Primary (email-safe) link:
    const verify_url = `${base}/v.html?t=${encodeURIComponent(token)}`;

    // Secondary (direct hash route) link:
    const verify_hash_url = `${base}/#/verify/${encodeURIComponent(token)}`;

    return json(res, 200, {
      ok: true,
      token,
      verify_url,
      verify_hash_url,
      load_id: load_id ?? null,
      starts_at,
      expires_at,
      status: "active",
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error issuing verify link." });
  }
}
