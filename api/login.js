// /api/login.js
// POST { email, access_code } -> { ok: true, email, role }
//
// Server-side login validation against Supabase table: beta_requests
// Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//
// This version uses supabase-js (more reliable than raw REST calls).

import { createClient } from "@supabase/supabase-js";

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
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json(res, 500, {
      ok: false,
      error: "Server missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
      has_SUPABASE_URL: !!SUPABASE_URL,
      has_SUPABASE_SERVICE_ROLE_KEY: !!SERVICE_KEY,
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

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  // We try a safe lookup strategy:
  // 1) Find rows matching email (either email or business_email).
  // 2) Validate access_code locally (case-insensitive).
  // This avoids hard dependency on filter quirks and keeps behavior stable.
  const selectCols =
    "id,created_at,email,business_email,access_code,status,approved,approved_at,is_approved,role";

  const { data, error } = await supabase
    .from("beta_requests")
    .select(selectCols)
    .or(`email.ilike.${email},business_email.ilike.${email}`)
    .limit(10);

  if (error) {
    return json(res, 500, {
      ok: false,
      error: "Supabase query failed",
      supabase_error: error.message || String(error),
      hint:
        "If this used to work, check Vercel Production env vars: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Also confirm table name beta_requests exists.",
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    return json(res, 401, { ok: false, error: "Access denied" });
  }

  const codeUpper = access_code.toUpperCase();

  const match = data.find((row) => {
    const rowCode = String(row?.access_code || "").trim().toUpperCase();
    return rowCode && rowCode === codeUpper;
  });

  if (!match) {
    return json(res, 401, { ok: false, error: "Access denied" });
  }

  // Approval logic:
  // If approval markers exist, enforce them. Otherwise allow code-match (manual beta codes).
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
}
