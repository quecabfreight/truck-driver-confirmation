export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "Use POST." });
    }

    // Safe body parsing
    let body = {};
    try {
      if (typeof req.body === "object") body = req.body;
      else body = JSON.parse(req.body || "{}");
    } catch {
      body = {};
    }

    const admin_key = String(body.admin_key || "").trim();
    const id = String(body.id || "").trim();

    const ADBS_ADMIN_KEY = (process.env.ADBS_ADMIN_KEY || "").trim();
    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!ADBS_ADMIN_KEY) return json(res, 500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SUPABASE_SERVICE_ROLE_KEY) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    if (admin_key !== ADBS_ADMIN_KEY) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    if (!id) {
      return json(res, 400, { ok: false, error: "Missing id." });
    }

    // Generate a clean QC-###### code
    const access_code = makeCode();

    const url = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

    const r = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        approved: true,
        status: "approved",
        access_code,
      }),
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!r.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (approve).", details: data });
    }

    return json(res, 200, { ok: true, access_code, updated: data });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Server error (approve).",
      details: String(err?.message || err),
    });
  }
}

function makeCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `QC-${n}`;
}

function json(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
