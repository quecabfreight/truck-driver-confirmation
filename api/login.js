// /api/login.js
// POST { email, access_code }  -> { ok: true, role, email }
// Uses server-side SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (bypasses RLS safely on server)
//
// This version adds SAFE diagnostics:
// - returns supabase_status and a short supabase_error snippet on failure
// - avoids complex OR filters; queries by access_code first (more reliable)

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

function safeSnippet(s, max = 500) {
  const t = String(s || "");
  return t.length > max ? t.slice(0, max) + "…" : t;
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
      has_SUPABASE_URL: !!SUPABASE_URL,
      has_SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    });
  }

  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    // ignore
  }

  const email = normEmail(body?.email);
  const access_code = normCode(body?.access_code);

  if (!email || !access_code) {
    return json(res, 400, { ok: false, error: "Missing email or access_code" });
  }

  // Query by access_code (simple and robust).
  // Then validate that the email matches either `email` or `business_email` if present.
  const codeUpper = access_code.toUpperCase();

  const select =
    "id,created_at,email,business_email,access_code,status,approved,approved_at,is_approved,role";

  const url =
    `${SUPABASE_URL}/rest/v1/beta_requests` +
    `?select=${encodeURIComponent(select)}` +
    `&access_code=eq.${encodeURIComponent(access_code)}` +
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
        supabase_status: r.status,
        // Safe snippet only; no secrets included
        supabase_error: safeSnippet(text, 800),
        hint:
          "If status is 401/403, env keys are wrong or missing. If 404, SUPABASE_URL is wrong. If 400, query/table/columns mismatch.",
      });
    }

    // If exact-case match failed, try uppercase code match (common when codes are stored uppercase)
    if (!Array.isArray(rows) || rows.length === 0) {
      const url2 =
        `${SUPABASE_URL}/rest/v1/beta_requests` +
        `?select=${encodeURIComponent(select)}` +
        `&access_code=eq.${encodeURIComponent(codeUpper)}` +
        `&limit=5`;

      const r2 = await fetch(url2, {
        method: "GET",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const text2 = await r2.text();
      let rows2 = [];
      try {
        rows2 = text2 ? JSON.parse(text2) : [];
      } catch {
        rows2 = [];
      }

      if (!r2.ok) {
        return json(res, 500, {
          ok: false,
          error: "Supabase query failed",
          supabase_status: r2.status,
          supabase_error: safeSnippet(text2, 800),
        });
      }

      rows = rows2;
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return json(res, 401, { ok: false, error: "Access denied" });
    }

    // Find row where code matches (case-insensitive)
    const match = rows.find((row) => {
      const rowCode = String(row?.access_code || "").trim().toUpperCase();
      return rowCode && rowCode === codeUpper;
    });

    if (!match) {
      return json(res, 401, { ok: false, error: "Access denied" });
    }

    // Email match rules:
    // - If table has email/business_email: require one matches.
    // - If neither column exists/filled, allow (but that would be unusual).
    const rowEmail = String(match?.email || "").trim().toLowerCase();
    const rowBizEmail = String(match?.business_email || "").trim().toLowerCase();

    const hasAnyEmail = !!rowEmail || !!rowBizEmail;
    const emailOk = !hasAnyEmail || rowEmail === email || rowBizEmail === email;

    if (!emailOk) {
      return json(res, 401, { ok: false, error: "Access denied" });
    }

    // Approval logic:
    // If approval markers exist, enforce them. Otherwise allow code-match.
    const hasApprovalSignals =
      ("approved" in match) ||
      ("approved_at" in match) ||
      ("is_approved" in match) ||
      ("status" in match);

    let approved = true;

    if (hasApprovalSignals) {
      const status = String(match?.status || "").toLowerCase();
      const approvedBool = match?.approved === true || match?.is_approved === true;
      const approvedAt = !!match?.approved_at;

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
