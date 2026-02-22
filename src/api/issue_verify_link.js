// /api/issue_verify_link.js
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

function toUpperClean(s) {
  return String(s || "").toUpperCase().trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, { ok: false, error: "Server missing Supabase env vars." });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const body = req.body || {};
    const load_id = String(body.load_id || "").trim();

    const usdot_digits = onlyDigits(body.usdot_on_record);
    const plate_upper = toUpperClean(body.plate_on_record);
    const driver_phone_digits = onlyDigits(body.driver_phone);

    const starts_at = body.starts_at || null;
    const expires_at = body.expires_at === null ? null : body.expires_at || null;

    if (!load_id) return json(res, 400, { ok: false, error: "load_id is required" });
    if (!usdot_digits) return json(res, 400, { ok: false, error: "usdot_on_record is required" });
    if (!plate_upper) return json(res, 400, { ok: false, error: "plate_on_record is required" });

    // Driver phone can be stored as digits or formatted; we keep digits-only in DB.
    if (driver_phone_digits.length !== 10) {
      return json(res, 400, { ok: false, error: "driver_phone must be 10 digits" });
    }

    if (!starts_at) {
      return json(res, 400, { ok: false, error: "starts_at is required" });
    }
    // expires_at may be null (No Expire)

    // Create token (URL-safe)
    const token =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2);

    const row = {
      token,
      load_id,
      usdot_on_record: usdot_digits,
      plate_on_record: plate_upper,
      driver_phone: driver_phone_digits,
      status: "active",
      starts_at,
      expires_at,
    };

    const { data, error } = await supabase
      .from("verify_links")
      .insert(row)
      .select("token, load_id, status, starts_at, expires_at")
      .single();

    if (error) {
      return json(res, 500, { ok: false, error: error.message });
    }

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host);

    const verify_url = `${origin}/#/verify/${token}`;

    return json(res, 200, {
      ok: true,
      token: data.token,
      load_id: data.load_id,
      status: data.status,
      starts_at: data.starts_at,
      expires_at: data.expires_at,
      verify_url,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error issuing verification." });
  }
}
