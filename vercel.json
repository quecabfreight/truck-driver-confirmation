export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const { admin_key } = readJson(req) || {};
    const ADBS_ADMIN_KEY = (process.env.ADBS_ADMIN_KEY || "").trim();

    if (!ADBS_ADMIN_KEY) return json(res, 500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if ((String(admin_key || "").trim() !== ADBS_ADMIN_KEY)) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SRK = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SRK) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    const url =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=id,created_at,business_email,status,approved,access_code,name,legal_name,legal_business_name,business_name,role,business_phone,phone` +
      `&order=created_at.desc` +
      `&limit=50`;

    const r = await fetch(url, {
      method: "GET",
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}` },
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    if (!r.ok) return json(res, 500, { ok: false, error: "Supabase error (list).", details: data });

    return json(res, 200, { ok: true, rows: Array.isArray(data) ? data : [] });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error (list).", details: String(e?.message || e) });
  }
}

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function readJson(req) {
  try {
    // Vercel provides req.body sometimes; but safe fallback:
    if (req.body && typeof req.body === "object") return req.body;
    return null;
  } catch {
    return null;
  }
}
