// /api/reveal_driver_phone.js
// Purpose:
// - GET  -> health check (confirms DOCK_ACCESS_PIN is present in deployed env)
// - POST -> validates dock_pin and returns masked driver phone for the verify page
//
// Env required:
// - DOCK_ACCESS_PIN
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
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

function isWithinWindow(starts_at, expires_at) {
  const now = Date.now();
  try {
    if (starts_at) {
      const s = Date.parse(starts_at);
      if (!Number.isNaN(s) && now < s) return false;
    }
    if (expires_at) {
      const e = Date.parse(expires_at);
      if (!Number.isNaN(e) && now > e) return false;
    }
  } catch {}
  return true;
}

async function getLinkByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !KEY) {
    return { error: "Server missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." };
  }

  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?select=token,load_id,driver_phone,status,starts_at,expires_at` +
    `&token=eq.${encodeURIComponent(token)}` +
    `&limit=1`;

  const r = await fetch(url, {
    method: "GET",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
  });

  const text = await r.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!r.ok) {
    return { error: `Supabase error (${r.status}).`, detail: data || text };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return { error: "Link not found." };
  }

  return { link: data[0] };
}

export default async function handler(req, res) {
  // CORS / preflight safety (some devices/browsers)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return json(res, 200, { ok: true });
  }

  // ✅ Browser-friendly health check
  if (req.method === "GET") {
    const hasPin = !!process.env.DOCK_ACCESS_PIN;
    const hasSbUrl = !!process.env.SUPABASE_URL;
    const hasSrk = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    return json(res, 200, {
      ok: true,
      endpoint: "reveal_driver_phone",
      has_DOCK_ACCESS_PIN: hasPin,
      has_SUPABASE_URL: hasSbUrl,
      has_SUPABASE_SERVICE_ROLE_KEY: hasSrk,
      note: "Use POST with { token, dock_pin } to reveal phone.",
    });
  }

  // Real action
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  // Parse body
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {}

  const token = String(body.token || body.t || "").trim();
  const dock_pin = String(body.dock_pin || body.pin || "").trim();

  if (!token) return json(res, 400, { error: "Missing token." });

  const serverPin = String(process.env.DOCK_ACCESS_PIN || "").trim();
  if (!serverPin) return json(res, 500, { error: "Server missing DOCK_ACCESS_PIN." });

  if (!dock_pin) return json(res, 400, { error: "Missing dock_pin." });

  if (dock_pin !== serverPin) {
    return json(res, 403, { error: "Dock authorization failed (bad PIN)." });
  }

  const found = await getLinkByToken(token);
  if (found.error) return json(res, 404, { error: found.error });

  const link = found.link;

  if (String(link.status || "").toLowerCase() !== "active") {
    return json(res, 403, { error: "Link is not active." });
  }

  if (!isWithinWindow(link.starts_at, link.expires_at)) {
    return json(res, 403, { error: "Link not currently valid (start/expire window)." });
  }

  const phone = formatPhoneHyphen(link.driver_phone || "");

  return json(res, 200, {
    ok: true,
    driver_phone: phone, // formatted for display + manual dialing backup
    load_id: link.load_id ?? null,
    token: link.token,
  });
}
