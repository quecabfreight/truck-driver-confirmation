import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeAccessCode(v) {
  const raw = String(v || "").toUpperCase().trim();
  const digits = raw.replace(/\D+/g, "");
  if (!digits) return raw.replace(/\s+/g, "").replace(/-+/g, "-");
  return `QC-${digits}`;
}

function norm(v) {
  return String(v || "").trim().toLowerCase();
}

function isAllowed(account) {
  const accountType = norm(account.account_type || "broker");
  const subscriptionStatus = norm(account.subscription_status || "beta_active");
  const status = norm(account.status || "active");

  if (accountType === "internal") return true;
  if (subscriptionStatus === "internal") return true;

  if (status !== "active") return false;

  return ["beta_active", "trial_active", "paid_active"].includes(
    subscriptionStatus
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

    const email = normalizeEmail(body.email);
    const accessCode = normalizeAccessCode(body.access_code);

    if (!email) {
      return json(res, 400, {
        ok: false,
        error: "Enter your business email."
      });
    }

    if (!accessCode) {
      return json(res, 400, {
        ok: false,
        error: "Enter your access code."
      });
    }

    const { data, error } = await supabase
      .from("broker_accounts")
      .select(
        "id, company_name, business_email, access_code, role, status, contact_name, business_phone, account_type, subscription_status, plan_name, monthly_verification_limit"
      )
      .eq("business_email", email)
      .eq("access_code", accessCode)
      .eq("role", "broker")
      .maybeSingle();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Login lookup failed."
      });
    }

    if (!data) {
      return json(res, 401, {
        ok: false,
        error: "Email or access code is incorrect."
      });
    }

    if (!isAllowed(data)) {
      return json(res, 403, {
        ok: false,
        error:
          "This account is not currently active. Please contact QueCab AdbS support.",
        subscription_status: data.subscription_status || "",
        account_status: data.status || ""
      });
    }

    return json(res, 200, {
      ok: true,
      email: data.business_email,
      role: data.role,
      company_name: data.company_name || "",
      contact_name: data.contact_name || "",
      business_phone: data.business_phone || "",
      account_type: data.account_type || "broker",
      subscription_status: data.subscription_status || "beta_active",
      plan_name: data.plan_name || "",
      monthly_verification_limit: data.monthly_verification_limit || null
    });
  } catch (e) {
    return json(res, 500, {
      ok: false,
      error: String(e?.message || "Server error")
    });
  }
}
