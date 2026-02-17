// /api/login.js
// POST { email, access_code }  -> { ok: true, role, email }
// Uses server-side SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (bypasses RLS safely on server)

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function normEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function normCode(v) {
  return String(v || "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, {
      ok: false,
      error: "Server missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  let body = req.body;
  try {
    // Vercel usually parses JSON body for us, but keep this safe.
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    body = req.body;
  }

  const email = normEmail(body?.email);
  const access_code = normCode(body?.access_code);

  if (!email || !access_code) {
    return json(res, 400, { ok: false, error: "Missing email or access_code" });
  }

  // Query beta_requests directly via Supabase REST (service role bypasses RLS)
  // We select broad fields so this endpoint survives column name changes.
  const url =
    `${SUPABASE_URL}/rest/v1/beta_requests` +
    `?select=id,email,business_email,access_code,status,approved,approved_at,is_approved,role` +
    `&or=(email.ilike.${encodeURIComponent(email)},business_email.ilike.${encodeURIComponent(email)})` +
    `&limit=5`;

  try {
    const r = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const text = await r.text();
    let rows = [];
    try {
      rows = text ? JSON.parse(text) : [];
    } catch {
      rows = [];
    }

    if (!r.ok) {
      return json(res, 500, {
        ok: false,
        error: "Supabase query failed",
        status: r.status,
      });
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return json(res, 401, { ok: false, error: "Access denied" });
    }

    // Find a matching row by access code (case-insensitive compare)
    const codeUpper = access_code.toUpperCase();
    const match = rows.find((row) => {
      const rowCode = String(row?.access_code || "").trim().toUpperCase();
      return rowCode && rowCode === codeUpper;
    });

    if (!match) {
      return json(res, 401, { ok: false, error: "Access denied" });
    }

    // Approval logic:
    // If your table has approval markers, require them.
    // If not present, we still allow code-match (because you manually issue codes).
    const hasApprovalSignals =
      ("approved" in match) ||
      ("approved_at" in match) ||
      ("is_approved" in match) ||
      ("status" in match);

    let approved = true;

    if (hasApprovalSignals) {
      const status = String(match?.status || "").toLowerCase();
      const approvedBool =
        match?.approved === true ||
        match?.is_approved === true;

      const approvedAt = match?.approved_at ? true : false;

      // Accept common patterns
      approved =
        approvedBool ||
        approvedAt ||
        status === "approved" ||
        status === "active" ||
        status === "authorized";
    }

    if (!approved) {
      return json(res, 403, { ok: false, error: "Not approved yet" });
    }

    return json(res, 200, {
      ok: true,
      email,
      role: match?.role || "authorized",
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || "Server error" });
  }
}
