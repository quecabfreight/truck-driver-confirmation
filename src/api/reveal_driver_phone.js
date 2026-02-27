// /src/api/reveal_driver_phone.js
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

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "POST required." });
    }

    const body = req.body || {};
    const t = String(body.t || body.token || "").trim();
    const pin = String(body.pin || "").trim();

    if (!t) return json(res, 400, { ok: false, error: "Missing token." });
    if (!pin) return json(res, 400, { ok: false, error: "Enter Dock PIN." });

    const expected = String(process.env.DOCK_ACCESS_PIN || "").trim();
    if (!expected) {
      return json(res, 500, { ok: false, error: "Dock PIN is not configured on server." });
    }

    if (pin !== expected) {
      return json(res, 401, { ok: false, error: "Invalid Dock PIN." });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return json(res, 500, { ok: false, error: "Server not configured (Supabase env missing)." });
    }

    const sb = createClient(url, key, { auth: { persistSession: false } });

    const { data, error } = await sb
      .from("verify_links")
      .select("token, driver_phone, status, starts_at, expires_at")
      .eq("token", t)
      .maybeSingle();

    if (error) return json(res, 500, { ok: false, error: error.message });
    if (!data) return json(res, 404, { ok: false, error: "Link not found." });

    // Optional: block revoked/inactive
    if (String(data.status || "").toLowerCase() !== "active") {
      return json(res, 403, { ok: false, error: "Link is not active." });
    }

    const phoneDigits = onlyDigits(data.driver_phone);
    if (phoneDigits.length < 10) {
      return json(res, 200, { ok: true, driver_phone: phoneDigits || "" });
    }

    return json(res, 200, { ok: true, driver_phone: phoneDigits.slice(0, 10) });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Unexpected server error." });
  }
}
