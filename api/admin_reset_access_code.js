// /api/admin_reset_access_code.js
// POST { email } -> finds request row by email/business_email and resets access_code
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
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "QC-";
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function safeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function enc(v) {
  return encodeURIComponent(String(v));
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

  const email = safeEmail(body.email);
  if (!email) return json(res, 400, { error: "Missing email." });

  const access_code = makeCode();

  // Try to update by (email OR business_email) to be schema-flexible.
  // PostgREST supports or=()
  const url = `${SUPABASE_URL}/rest/v1/beta_requests?or=(${enc(`email.eq.${email}`)},${enc(`business_email.eq.${email}`)})`;

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
        access_code,
        approved: true,
      }),
    });

    const text = await r.text();

    if (!r.ok) {
      return json(res, r.status, {
        error: "Supabase update failed.",
        details: text?.slice(0, 800) || "",
      });
    }

    let rows = [];
    try { rows = JSON.parse(text); } catch { rows = []; }

    if (!Array.isArray(rows) || rows.length === 0) {
      return json(res, 404, { error: "No matching beta request found for that email." });
    }

    return json(res, 200, {
      ok: true,
      email,
      access_code,
      rows,
    });
  } catch {
    return json(res, 500, { error: "Network/server error updating Supabase." });
  }
}
