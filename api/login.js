// /api/login.js
// POST { email, access_code } -> { ok: true, email, role }
//
// Robust login validation against Supabase table: beta_requests
// - DOES NOT assume column names beyond access_code
// - Pulls full row (select("*")) and checks any common email fields
// Uses SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY

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

function pickEmail(row) {
  if (!row || typeof row !== "object") return "";

  // Try common candidates without assuming your schema
  const candidates = [
    row.business_email,
    row.email,
    row.contact_email,
    row.user_email,
    row.company_email,
    row.owner_email,
  ]
    .map((x) => String(x || "").trim().toLowerCase())
    .filter(Boolean);

  return candidates[0] || "";
}

function isApproved(row) {
  if (!row || typeof row !== "object") return true;

  const status = String(row.status || "").trim().toLowerCase();

  const approvedBool =
    row.approved === true ||
    row.is_approved === true ||
    row.isApproved === true;

  const approvedAt =
    !!row.approved_at ||
    !!row.approvedAt;

  // If none of these exist, default allow (manual beta codes)
  const hasSignals =
    ("approved" in row) ||
    ("is_approved" in row) ||
    ("approved_at" in row) ||
    ("status" in row);

  if (!hasSignals) return true;

  return (
    approvedBool ||
    approvedAt ||
    status === "approved" ||
    status === "active" ||
    status === "authorized"
  );
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

  // Case-insensitive match on access_code (so QC-123 works no matter how stored)
  const codeUpper = access_code.toUpperCase();

  const { data, error } = await supabase
    .from("beta_requests")
    .select("*")
    .ilike("access_code", codeUpper)
    .limit(5);

  if (error) {
    return json(res, 500, {
      ok: false,
      error: "Supabase query failed",
      supabase_error: error.message || String(error),
      hint:
        "If this used to work, likely schema changed or beta_requests table is not accessible by service role (rare).",
    });
  }

  if (!Array.isArray(data) || data.length === 0) {
    return json(res, 401, { ok: false, error: "Access denied" });
  }

  // If multiple rows somehow match, take the one with exact code (case-insensitive)
  const match =
    data.find((r) => String(r?.access_code || "").trim().toUpperCase() === codeUpper) ||
    data[0];

  // Validate email against whichever email field exists on the row
  const rowEmail = pickEmail(match);

  // If the row has an email value, enforce it. If not stored, allow (but that’s unusual).
  if (rowEmail && rowEmail !== email) {
    return json(res, 401, { ok: false, error: "Access denied" });
  }

  // Enforce approval if your table contains approval fields
  if (!isApproved(match)) {
    return json(res, 403, { ok: false, error: "Not approved yet" });
  }

  return json(res, 200, {
    ok: true,
    email,
    role: match?.role || "authorized",
  });
}
