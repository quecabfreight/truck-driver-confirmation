// /api/reveal_driver_phone.js
// GET  -> health check (confirms env + Supabase connectivity basics)
// POST -> validates dock_pin (per-link first, else env DOCK_ACCESS_PIN), then returns formatted driver phone
//
// Env required:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// Optional fallback:
// - DOCK_ACCESS_PIN   (used only if verify_links.dock_pin is NULL)

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function formatPhoneHyphen(digits) {
  const d = onlyDigits(digits).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

async function sbFetchLinkByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const url = `${SUPABASE_URL}/rest/v1/verify_links?token=eq.${encodeURIComponent(token)}&select=token,status,driver_phone,expires_at,starts_at,dock_pin`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = [];
  }

  if (!res.ok) {
    const msg = `Supabase fetch failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return Array.isArray(data) ? data[0] : null;
}

function isExpired(link) {
  const now = Date.now();
  if (link?.starts_at) {
    const s = Date.parse(link.starts_at);
    if (!Number.isNaN(s) && now < s) return true;
  }
  if (link?.expires_at) {
    const x = Date.parse(link.expires_at);
    if (!Number.isNaN(x) && now > x) return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const has = (k) => !!String(process.env[k] || "").trim();
    return json(res, 200, {
      ok: true,
      endpoint: "reveal_driver_phone",
      has_DOCK_ACCESS_PIN: has("DOCK_ACCESS_PIN"),
      has_SUPABASE_URL: has("SUPABASE_URL"),
      has_SUPABASE_SERVICE_ROLE_KEY: has("SUPABASE_SERVICE_ROLE_KEY"),
      note: "Use POST with { token, dock_pin } to reveal phone.",
    });
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const token = String(body.token || "").trim();
    const pin = onlyDigits(body.dock_pin).slice(0, 6);

    if (!token) return json(res, 400, { ok: false, error: "Missing token." });
    if (!pin) return json(res, 400, { ok: false, error: "Enter Dock PIN." });

    const link = await sbFetchLinkByToken(token);
    if (!link) return json(res, 404, { ok: false, error: "Link not found." });

    if (String(link.status || "").toLowerCase() !== "active") {
      return json(res, 403, { ok: false, error: "Link is not active." });
    }
    if (isExpired(link)) {
      return json(res, 403, { ok: false, error: "Link is expired or not yet active." });
    }

    // Per-link PIN wins. If not set, fall back to env DOCK_ACCESS_PIN.
    const perLink = onlyDigits(link.dock_pin || "").slice(0, 6);
    const fallback = onlyDigits(process.env.DOCK_ACCESS_PIN || "").slice(0, 6);
    const expected = perLink || fallback;

    if (!expected) {
      return json(res, 500, { ok: false, error: "Server missing DOCK_ACCESS_PIN." });
    }

    if (pin !== expected) {
      return json(res, 401, { ok: false, error: "Invalid Dock PIN." });
    }

    const phone = formatPhoneHyphen(link.driver_phone || "");
    return json(res, 200, { ok: true, driver_phone: phone });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
