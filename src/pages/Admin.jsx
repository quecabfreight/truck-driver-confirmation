import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function safe(v) {
  return String(v || "").trim();
}

function normalize(v) {
  return safe(v).toLowerCase();
}

function intValue(v) {
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

function isAllowedAction(v) {
  return [
    "set_internal",
    "set_beta_active",
    "set_trial_active",
    "set_paid_active",
    "set_canceled",
    "set_suspended",
    "grant_bonus_verifications",
    "clear_bonus_verifications"
  ].includes(normalize(v));
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
        ? JSON.parse(req.body)
        : req.body || {};

    const adminKey = safe(
      body.admin_key || req.headers["x-adbs-admin-key"]
    );

    const requiredKey = safe(process.env.ADBS_ADMIN_KEY);

    if (!requiredKey) {
      return json(res, 500, {
        ok: false,
        error: "Missing ADBS_ADMIN_KEY env variable."
      });
    }

    if (!adminKey || adminKey !== requiredKey) {
      return json(res, 401, {
        ok: false,
        error: "Unauthorized."
      });
    }

    const email = normalize(body.email);
    const action = normalize(body.action);

    if (!email) {
      return json(res, 400, {
        ok: false,
        error: "Missing email."
      });
    }

    if (!isAllowedAction(action)) {
      return json(res, 400, {
        ok: false,
        error: "Invalid action."
      });
    }

    let updates = {};

    if (action === "set_internal") {
      updates = {
        account_type: "internal",
        subscription_status: "internal",
        plan_name: "internal",
        monthly_verification_limit: 999999,
        status: "active"
      };
    }

    if (action === "set_beta_active") {
      updates = {
        account_type: "broker",
        subscription_status: "beta_active",
        plan_name: "founding_beta",
        monthly_verification_limit: 100,
        status: "active"
      };
    }

    if (action === "set_trial_active") {
      updates = {
        account_type: "broker",
        subscription_status: "trial_active",
        status: "active"
      };
    }

    if (action === "set_paid_active") {
      updates = {
        account_type: "broker",
        subscription_status: "paid_active",
        status: "active"
      };
    }

    if (action === "set_canceled") {
      updates = {
        subscription_status: "canceled",
        status: "active"
      };
    }

    if (action === "set_suspended") {
      updates = {
        subscription_status: "suspended",
        status: "active"
      };
    }

    if (action === "grant_bonus_verifications") {
      const bonusToAdd = intValue(body.bonus_verifications);
      const reason = safe(body.bonus_reason);

      if (bonusToAdd <= 0) {
        return json(res, 400, {
          ok: false,
          error: "Enter bonus verification amount greater than 0."
        });
      }

      const { data: existing, error: existingError } = await supabase
        .from("broker_accounts")
        .select("bonus_verifications")
        .eq("business_email", email)
        .maybeSingle();

      if (existingError) {
        return json(res, 500, {
          ok: false,
          error: existingError.message || "Could not load current credits."
        });
      }

      if (!existing) {
        return json(res, 404, {
          ok: false,
          error: "Broker account not found."
        });
      }

      const currentBonus = intValue(existing.bonus_verifications);
      const newBonusTotal = currentBonus + bonusToAdd;

      updates = {
        bonus_verifications: newBonusTotal,
        bonus_reason: reason || `Added ${bonusToAdd} courtesy credits`,
        bonus_granted_at: new Date().toISOString()
      };
    }

    if (action === "clear_bonus_verifications") {
      updates = {
        bonus_verifications: 0,
        bonus_reason: null,
        bonus_granted_at: null
      };
    }

    const { data, error } = await supabase
      .from("broker_accounts")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("business_email", email)
      .select("*")
      .maybeSingle();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Update failed."
      });
    }

    if (!data) {
      return json(res, 404, {
        ok: false,
        error: "Broker account not found."
      });
    }

    return json(res, 200, {
      ok: true,
      message: "Broker account updated.",
      account: {
        business_email: data.business_email,
        account_type: data.account_type,
        subscription_status: data.subscription_status,
        plan_name: data.plan_name,
        monthly_verification_limit: data.monthly_verification_limit,
        bonus_verifications: data.bonus_verifications || 0,
        bonus_reason: data.bonus_reason || "",
        bonus_granted_at: data.bonus_granted_at || "",
        status: data.status
      }
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
