import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const email = normalizeEmail(body.email);

    if (!email) {
      return json(res, 400, {
        ok: false,
        error: "Missing email."
      });
    }

    const { data, error } = await supabase
      .from("broker_accounts")
      .select(
        "business_email, account_type, subscription_status, status, plan_name, monthly_verification_limit"
      )
      .eq("business_email", email)
      .maybeSingle();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Subscription lookup failed."
      });
    }

    if (!data) {
      return json(res, 404, {
        ok: false,
        error: "Broker account not found."
      });
    }

    const accountType = String(data.account_type || "").trim().toLowerCase();
    const subscriptionStatus = String(data.subscription_status || "")
      .trim()
      .toLowerCase();
    const accountStatus = String(data.status || "").trim().toLowerCase();

    const allowed =
      accountStatus === "active" &&
      (accountType === "internal" || subscriptionStatus === "paid_active");

    return json(res, 200, {
      ok: true,
      allowed,
      business_email: data.business_email,
      account_type: accountType,
      subscription_status: subscriptionStatus,
      status: accountStatus,
      plan_name: data.plan_name || "",
      monthly_verification_limit: data.monthly_verification_limit || null
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
