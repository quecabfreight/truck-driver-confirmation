// /api/login.js
// POST { email, access_code } -> verifies approved beta request and returns role
// Debug-friendly: returns Supabase error details if DB query fails.

import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function cleanEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function cleanCode(v) {
  return String(v || "").trim().toUpperCase();
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
      error: "Server missing Supabase env.",
      has_SUPABASE_URL: !!SUPABASE_URL,
      has_SUPABASE_SERVICE_ROLE_KEY: !!SUPABASE_SERVICE_ROLE_KEY,
    });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {}

  const email = cleanEmail(body.email);
  const accessCode = cleanCode(body.access_code);

  if (!email || !email.includes("@")) {
    return json(res, 400, { ok: false, error: "Missing/invalid email." });
  }
  if (!accessCode) {
    return json(res, 400, { ok: false, error: "Missing access code." });
  }

  try {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Force public schema (prevents “wrong schema” surprises)
    const base = sb.schema("public").from("beta_requests");

    // Try strict match first (most reliable)
    let q = await base
      .select("id,email,role,status,access_code")
      .eq("email", email)
      .limit(25);

    // If strict match returns nothing, try case-insensitive match
    if (!q.error && Array.isArray(q.data) && q.data.length === 0) {
      q = await base
        .select("id,email,role,status,access_code")
        .ilike("email", email)
        .limit(25);
    }

    if (q.error) {
      // IMPORTANT: This is the real clue you need to paste back to me.
      return json(res, 500, {
        ok: false,
        error: "DB error loading beta request.",
        supabase: {
          message: q.error.message,
          details: q.error.details,
          hint: q.error.hint,
          code: q.error.code,
        },
      });
    }

    const rows = Array.isArray(q.data) ? q.data : [];
    const approved = rows.filter((r) => String(r.status || "").toLowerCase() === "approved");
    const match = approved.find((r) => cleanCode(r.access_code) === accessCode);

    if (!match) {
      return json(res, 403, { ok: false, error: "Access denied" });
    }

    return json(res, 200, {
      ok: true,
      email: match.email,
      role: String(match.role || "broker").toLowerCase(),
      status: match.status,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error during login." });
  }
}
