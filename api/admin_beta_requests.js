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
  return String(
    h["x-adbs-admin-key"] || h["X-Adbs-Admin-Key"] || ""
  ).trim();
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
    return json(res, 405, {
      ok: false,
      error: "Method not allowed",
    });
  }

  if (!isAuthorized(req)) {
    return json(res, 401, {
      ok: false,
      error: "Unauthorized (bad admin key).",
    });
  }

  const SUPABASE_URL = String(
    process.env.SUPABASE_URL || ""
  ).trim();

  const SUPABASE_SERVICE_ROLE_KEY = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  ).trim();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, {
      ok: false,
      error:
        "Missing env: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  const status = String(
    req.query?.status || "pending"
  ).trim().toLowerCase();

  const limit = Math.min(
    100,
    Math.max(1, qsInt(req.query?.limit, 25))
  );

  const offset = Math.max(
    0,
    qsInt(req.query?.offset, 0)
  );

  try {
    let url =
      ${SUPABASE_URL}/rest/v1/beta_requests +
      ?select=* +
      &order=created_at.desc +
      &limit=${limit} +
      &offset=${offset};

    if (status === "pending") {
      url +=
        &or=(status.eq.pending,approved.is.null,approved.eq.false);
    } else if (status === "approved") {
      url +=
        &or=(status.eq.approved,approved.eq.true);
    } else if (status === "all") {
      // no filter
    } else {
      return json(res, 400, {
        ok: false,
        error:
          "Invalid status. Use pending, approved, or all.",
      });
    }

    const r = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY},
        Prefer: "count=exact",
      },
    });

    const text = await r.text();

    let rows = [];

    try {
      rows = JSON.parse(text);
    } catch {
      rows = [];
    }

    if (!r.ok) {
      return json(res, r.status || 500, {
        ok: false,
        error: "Supabase query failed.",
        details: text?.slice(0, 1000) || "",
      });
    }

    const contentRange =
      r.headers.get("content-range") || "";

    let total = null;

    if (contentRange.includes("/")) {
      const parts = contentRange.split("/");
      const maybeTotal = Number.parseInt(parts[1], 10);

      if (Number.isFinite(maybeTotal)) {
        total = maybeTotal;
      }
    }

    return json(res, 200, {
      ok: true,
      rows: Array.isArray(rows) ? rows : [],
      total,
      status,
      limit,
      offset,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Server error loading beta requests.",
      details: String(err?.message || err),
    });
  }
}
