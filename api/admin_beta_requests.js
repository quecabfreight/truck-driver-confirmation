// /api/admin_beta_requests.js
// GET /api/admin_beta_requests?status=pending|approved|all&limit=25&offset=0
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

function qsInt(v, d) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : d;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  if (!isAuthorized(req)) {
    return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
  }

  const SUPABASE_URL = String(process.env.SUPABASE_URL || "").trim();
  const SERVICE_ROLE = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return json(res, 500, {
      ok: false,
      error: "Server missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY."
    });
  }

  const status = String(req.query?.status || "pending").toLowerCase();
  const limit = Math.min(100, Math.max(1, qsInt(req.query?.limit, 25)));
  const offset = Math.max(0, qsInt(req.query?.offset, 0));

  let url = `${SUPABASE_URL}/rest/v1/beta_requests?select=*`;
  url += `&order=created_at.desc`;
  url += `&limit=${limit}&offset=${offset}`;

  // Use status as the single source of truth
  if (status === "approved") {
    url += `&status=eq.approved`;
  } else if (status === "pending") {
    url += `&status=eq.pending`;
  } else if (status === "declined") {
    url += `&status=eq.declined`;
  }
  // "all" = no extra filter

  try {
    const r = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        Prefer: "count=exact"
      }
    });

    const text = await r.text();
    let rows = [];

    try {
      rows = JSON.parse(text);
    } catch {
      rows = [];
    }

    if (!r.ok) {
      return json(res, r.status, {
        ok: false,
        error: "Supabase query failed.",
        details: text?.slice(0, 800) || ""
      });
    }

    const cr = r.headers.get("content-range") || "";
    let total = null;

    try {
      const parts = cr.split("/");
      if (parts.length === 2) total = Number.parseInt(parts[1], 10);
      if (!Number.isFinite(total)) total = null;
    } catch {
      total = null;
    }

    return json(res, 200, {
      ok: true,
      rows: Array.isArray(rows) ? rows : [],
      total
    });
  } catch (e) {
    return json(res, 500, {
      ok: false,
      error: "Network/server error querying Supabase."
    });
  }
}
