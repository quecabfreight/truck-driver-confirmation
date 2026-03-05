// /api/login.js
// POST { email, access_code } -> verifies approved beta request and returns role
// Case-insensitive access code match (server-side), trims whitespace.

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
  // Match the way the UI behaves: uppercase + trim
  return String(v || "").trim().toUpperCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { ok: false, error: "Server missing Supabase env." });
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

    // Pull approved row(s) for this email.
    const { data, error } = await sb
      .from("beta_requests")
      .select("id,email,role,status,access_code")
      .ilike("email", email) // email compare case-insensitive
      .limit(25);

    if (error) {
      return json(res, 500, { ok: false, error: "DB error loading beta request." });
    }

    const rows = Array.isArray(data) ? data : [];
    const approved = rows.filter((r) => String(r.status || "").toLowerCase() === "approved");

    // Case-insensitive code match (normalize both sides)
    const match = approved.find((r) => cleanCode(r.access_code) === accessCode);

    if (!match) {
      // Helpful but not too revealing
      return json(res, 403, { ok: false, error: "Access denied" });
    }

    const role = String(match.role || "broker").toLowerCase();

    return json(res, 200, {
      ok: true,
      email: match.email,
      role,
      status: match.status,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error during login." });
  }
}
