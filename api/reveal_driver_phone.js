// /src/api/reveal_driver_phone.js
// POST { token, dock_pin } -> { ok:true, driver_phone:"585-506-1158" }
// Reveals ONLY the driver phone (no DOT/plate leak) after dock PIN validation.

import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function cleanStr(v) {
  return String(v || "").trim();
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, { error: "Server missing Supabase env vars." });
    }

    const DOCK_ACCESS_PIN = cleanStr(process.env.DOCK_ACCESS_PIN);
    if (!DOCK_ACCESS_PIN) {
      return json(res, 500, { error: "Server missing DOCK_ACCESS_PIN." });
    }

    const body = req.body || {};
    const token = cleanStr(body.token);
    const dock_pin = onlyDigits(body.dock_pin).slice(0, 6);

    if (!token) return json(res, 400, { error: "Missing token." });
    if (!dock_pin) return json(res, 400, { error: "Missing dock PIN." });

    if (dock_pin !== DOCK_ACCESS_PIN) {
      // Don't leak anything.
      return json(res, 401, { error: "Dock authorization denied." });
    }

    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await sb
      .from("verify_links")
      .select("driver_phone,status,starts_at,expires_at")
      .eq("token", token)
      .maybeSingle();

    if (error) return json(res, 500, { error: "Database error.", detail: error.message });

    if (!data) return json(res, 404, { error: "Link not found." });

    // Basic status/time checks (no leaks)
    if (String(data.status || "").toLowerCase() !== "active") {
      return json(res, 403, { error: "Link is not active." });
    }

    const now = Date.now();
    const startsAt = data.starts_at ? Date.parse(data.starts_at) : null;
    const expiresAt = data.expires_at ? Date.parse(data.expires_at) : null;

    if (startsAt && !Number.isNaN(startsAt) && now < startsAt) {
      return json(res, 403, { error: "Link not started yet." });
    }
    if (expiresAt && !Number.isNaN(expiresAt) && now > expiresAt) {
      return json(res, 403, { error: "Link expired." });
    }

    const phoneDigits = onlyDigits(data.driver_phone);
    if (phoneDigits.length !== 10) {
      return json(res, 422, { error: "Driver phone missing/invalid for this link." });
    }

    // Return only what the dock needs (backup manual dialing)
    return json(res, 200, { ok: true, driver_phone: phoneDigits });
  } catch (e) {
    return json(res, 500, { error: "Server error." });
  }
}
