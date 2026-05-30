// /api/login.js
// POST { email, access_code }
// Verifies broker account login and enforces subscription/access status.

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

function normalizeStatus(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeRole(v) {
  return String(v || "broker").trim().toLowerCase();
}

function allowedAccess(accountType, subscriptionStatus, accountStatus) {
  const type = normalizeStatus(accountType);
  const sub = normalizeStatus(subscriptionStatus);
  const status = normalizeStatus(accountStatus);

  if (type === "internal") return true;
  if (sub === "internal") return true;

  if (status && status !== "active") return false;

  return ["beta_active", "trial_active", "paid_active"].includes(sub);
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
      error: "Server missing Supabase environment variables."
    });
  }

  let body = {};

  try {
    body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
  } catch {
    body = {};
  }

  const email = cleanEmail(body.email);
  const accessCode = cleanCode(body.access_code);

  if (!email || !email.includes("@")) {
    return json(res, 400, { ok: false, error: "Missing/invalid email." });
  }

  if (!accessCode) {
    return json(res, 400, { ok: false, error: "Missing access code." });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    let result = await supabase
      .from("broker_accounts")
      .select(
        "id, company_name, business_email, access_code, role, status, contact_name, business_phone, account_type, subscription_status, plan_name, monthly_verification_limit"
      )
      .eq("business_email", email)
      .limit(1);

    if (
      !result.error &&
      Array.isArray(result.data) &&
      result.data.length === 0
    ) {
      result = await supabase
        .from("broker_accounts")
        .select(
          "id, company_name, business_email, access_code, role, status, contact_name, business_phone, account_type, subscription_status, plan_name, monthly_verification_limit"
        )
        .ilike("business_email", email)
        .limit(1);
    }

    if (result.error) {
      return json(res, 500, {
        ok: false,
        error: "Database error loading broker account.",
        detail: result.error.message || result.error
      });
    }

    const account = Array.isArray(result.data) ? result.data[0] : null;

    if (!account) {
      return json(res, 403, {
        ok: false,
        error: "Access denied."
      });
    }

    if (cleanCode(account.access_code) !== accessCode) {
      return json(res, 403, {
        ok: false,
        error: "Access denied."
      });
    }

    const accountType = normalizeStatus(account.account_type || "broker");
    const subscriptionStatus = normalizeStatus(
      account.subscription_status || "beta_active"
    );
    const accountStatus = normalizeStatus(account.status || "active");

    if (!allowedAccess(accountType, subscriptionStatus, accountStatus)) {
      return json(res, 403, {
        ok: false,
        error:
          "This account is not currently active. Please contact QueCab AdbS support.",
        subscription_status: subscriptionStatus,
        account_status: accountStatus
      });
    }

    return json(res, 200, {
      ok: true,
      email: cleanEmail(account.business_email),
      role: normalizeRole(account.role),
      status: accountStatus,
      account_type: accountType,
      subscription_status: subscriptionStatus,
      plan_name: account.plan_name || "",
      monthly_verification_limit:
        account.monthly_verification_limit || null,
      company_name: account.company_name || "",
      contact_name: account.contact_name || ""
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Server error during login."
    });
  }
}
