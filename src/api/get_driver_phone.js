// /src/api/get_driver_phone.js
import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length !== 10) return "";
  return `${a}-${b}-${c}`;
}

function isWithinWindow(startsAt, expiresAt) {
  const now = Date.now();
  const s = startsAt ? Date.parse(startsAt) : NaN;
  const e = expiresAt ? Date.parse(expiresAt) : NaN;

  if (!Number.isNaN(s) && now < s) return false;
  if (!Number.isNaN(e) && now > e) return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Single dock PIN for now (simple, fast, effective).
  // Set this in Vercel env: DOCK_ACCESS_PIN = 4-6 digits (e.g., 742913)
  const DOCK_ACCESS_PIN = String(process.env.DOCK_ACCESS_PIN || "").trim();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { ok: false, error: "Server missing Supabase env." });
  }
  if (!DOCK_ACCESS_PIN) {
    return json(res, 500, { ok: false, error: "Server missing DOCK_ACCESS_PIN." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    body = {};
  }

  const token = String(body.token || "").trim();
  const pin = String(body.pin || "").trim();

  if (!token) return json(res, 400, { ok: false, error: "Missing token." });
  if (!pin) return json(res, 400, { ok: false, error: "Enter dock PIN." });

  // Compare digits-only to avoid “spaces/dashes” nonsense
  if (onlyDigits(pin) !== onlyDigits(DOCK_ACCESS_PIN)) {
    return json(res, 403, { ok: false, error: "Dock authorization failed." });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: link, error } = await sb
    .from("verify_links")
    .select("token, driver_phone, status, starts_at, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error) return json(res, 500, { ok: false, error: "DB error loading link." });
  if (!link) return json(res, 404, { ok: false, error: "Verify link not found." });

  const status = String(link.status || "").toLowerCase();
  if (status === "revoked") return json(res, 403, { ok: false, error: "Link revoked.", revoked: true });
  if (!isWithinWindow(link.starts_at, link.expires_at)) {
    return json(res, 403, { ok: false, error: "Link not active (not started or expired)." });
  }

  const phone = formatPhoneHyphen(link.driver_phone || "");
  if (!phone) return json(res, 200, { ok: true, phone: "" });

  return json(res, 200, { ok: true, phone });
}
