export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const { admin_key, id } = readJson(req) || {};
    const ADBS_ADMIN_KEY = (process.env.ADBS_ADMIN_KEY || "").trim();

    if (!ADBS_ADMIN_KEY) return json(res, 500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if ((String(admin_key || "").trim() !== ADBS_ADMIN_KEY)) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SRK = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SRK) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    const rid = String(id || "").trim();
    if (!rid) return json(res, 400, { ok: false, error: "Missing id." });

    const access_code = makeCode();

    const url = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(rid)}`;

    const r = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SRK,
        Authorization: `Bearer ${SRK}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ approved: true, status: "approved", access_code }),
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }

    if (!r.ok) return json(res, 500, { ok: false, error: "Supabase error (approve).", details: data });

    return json(res, 200, { ok: true, access_code, updated: data });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error (approve).", details: String(e?.message || e) });
  }
}

function makeCode() {
  // readable digits only
  const n = Math.floor(100000 + Math.random() * 900000);
  return `QC-${n}`;
}

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function readJson(req) {
  try {
    if (req.body && typeof req.body === "object") return req.body;
    return null;
  } catch {
    return null;
  }
}
