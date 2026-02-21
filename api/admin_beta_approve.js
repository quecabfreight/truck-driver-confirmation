// /api/admin_beta_approve.js
// POST { id } -> sets approved=true and access_code=<generated>
// Requires header: x-adbs-admin-key

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function getAdminKey(req) {
  const h = req.headers || {};
  return String(h["x-adbs-admin-key"] || h["X-Adbs-Admin-Key"] || "").trim();
}

function isAuthorized(req) {
  const want = String(process.env.ADBS_ADMIN_KEY || "").trim();
  const got = getAdminKey(req);
  return !!want && !!got && got === want;
}

function makeCode() {
  // readable + short; change later if you want
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "QC-";
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function safeId(v) {
  return String(v || "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  if (!isAuthorized(req)) return json(res, 401, { error: "Unauthorized (bad admin key)." });

  const SUPABASE_URL = String(process.env.SUPABASE_URL || "").trim();
  const SERVICE_ROLE = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return json(res, 500, { error: "Server missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    body = {};
  }

  const id = safeId(body.id);
  if (!id) return json(res, 400, { error: "Missing id." });

  const access_code = makeCode();

  // PATCH beta_requests?id=eq.<id>
  const url = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

  try {
    const r = await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        approved: true,
        access_code,
      }),
    });

    const text = await r.text();

    if (!r.ok) {
      return json(res, r.status, {
        error: "Supabase update failed.",
        details: text?.slice(0, 800) || "",
      });
    }

    // return updated row(s)
    let rows = [];
    try { rows = JSON.parse(text); } catch { rows = []; }

    return json(res, 200, {
      ok: true,
      id,
      access_code,
      rows,
    });
  } catch {
    return json(res, 500, { error: "Network/server error updating Supabase." });
  }
}
