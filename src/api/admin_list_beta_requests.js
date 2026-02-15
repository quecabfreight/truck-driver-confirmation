// /api/admin_list_beta_requests.js
// POST { admin_key } -> returns latest beta_requests rows (admin-only)

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const body = await readJson(req);
    const adminKey = String(body?.admin_key || "").trim();

    if (!adminKey || adminKey !== String(process.env.ADBS_ADMIN_KEY || "")) {
      return json(res, 401, { ok: false, error: "Unauthorized" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return json(res, 500, { ok: false, error: "Missing env SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
    }

    const url =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=*` +
      `&order=created_at.desc` +
      `&limit=50`;

    const r = await fetch(url, {
      method: "GET",
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });

    const t = await r.text();
    if (!r.ok) return json(res, 500, { ok: false, error: "Supabase fetch failed", status: r.status, detail: safeJson(t) });

    return json(res, 200, { ok: true, rows: safeJson(t) });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error", detail: String(e?.message || e) });
  }
}

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

async function readJson(req) {
  try {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}
