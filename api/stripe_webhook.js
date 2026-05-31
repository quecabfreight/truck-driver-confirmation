import crypto from "crypto";
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

function safe(v) {
  return String(v || "").trim();
}

function normalizeEmail(v) {
  return safe(v).toLowerCase();
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      resolve(data);
    });

    req.on("error", reject);
  });
}

function parseStripeSignature(sigHeader) {
  const parts = String(sigHeader || "").split(",");
  const out = {};

  for (const part of parts) {
    const [key, value] = part.split("=");
    if (key && value) out[key.trim()] = value.trim();
  }

  return out;
}

function verifyStripeSignature(rawBody, sigHeader, webhookSecret) {
  const sig = parseStripeSignature(sigHeader);
  const timestamp = sig.t;
  const signature = sig.v1;

  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;

  const expected = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload, "utf8")
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}

async function updateBrokerByEmail(email, updates) {
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) {
    return { ok: false, error: "Missing broker email." };
  }

  const { data, error } = await supabase
    .from("broker_accounts")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("business_email", cleanEmail)
    .select("*")
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "Broker account not found." };
  }

  return { ok: true, data };
}

async function updateBrokerBySubscription(subscriptionId, updates) {
  const subId = safe(subscriptionId);

  if (!subId) {
    return { ok: false, error: "Missing subscription ID." };
  }

  const { data, error } = await supabase
    .from("broker_accounts")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("stripe_subscription_id", subId)
    .select("*")
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "Broker account not found by subscription ID." };
  }

  return { ok: true, data };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed"
    });
  }

  const webhookSecret = safe(process.env.STRIPE_WEBHOOK_SECRET);

  if (!webhookSecret) {
    return json(res, 500, {
      ok: false,
      error: "Missing STRIPE_WEBHOOK_SECRET in Vercel."
    });
  }

  try {
    const rawBody = await readRawBody(req);
    const sigHeader = req.headers["stripe-signature"];

    const valid = verifyStripeSignature(rawBody, sigHeader, webhookSecret);

    if (!valid) {
      return json(res, 400, {
        ok: false,
        error: "Invalid Stripe webhook signature."
      });
    }

    const event = JSON.parse(rawBody || "{}");
    const type = safe(event.type);
    const obj = event?.data?.object || {};

    if (type === "checkout.session.completed") {
      const email = normalizeEmail(obj.customer_email);
      const subscriptionId = safe(obj.subscription);
      const customerId = safe(obj.customer);
      const plan = safe(obj?.metadata?.plan || "founding_beta");

      const result = await updateBrokerByEmail(email, {
        account_type: "broker",
        subscription_status: "paid_active",
        plan_name: plan,
        monthly_verification_limit: 999999,
        stripe_subscription_id: subscriptionId || null,
        stripe_customer_id: customerId || null,
        billing_started_at: new Date().toISOString(),
        status: "active"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type,
        action: "broker_subscription_activated",
        result
      });
    }

    if (type === "customer.subscription.deleted") {
      const subscriptionId = safe(obj.id);

      const result = await updateBrokerBySubscription(subscriptionId, {
        subscription_status: "canceled",
        status: "active"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type,
        action: "broker_subscription_canceled",
        result
      });
    }

    if (type === "invoice.payment_failed") {
      const subscriptionId = safe(obj.subscription);

      const result = await updateBrokerBySubscription(subscriptionId, {
        subscription_status: "past_due",
        status: "active"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type,
        action: "broker_subscription_past_due",
        result
      });
    }

    if (type === "customer.subscription.updated") {
      const subscriptionId = safe(obj.id);
      const stripeStatus = safe(obj.status).toLowerCase();

      let subscriptionStatus = "paid_active";

      if (stripeStatus === "past_due") subscriptionStatus = "past_due";
      if (stripeStatus === "canceled") subscriptionStatus = "canceled";
      if (stripeStatus === "unpaid") subscriptionStatus = "past_due";
      if (stripeStatus === "incomplete_expired") subscriptionStatus = "canceled";

      const result = await updateBrokerBySubscription(subscriptionId, {
        subscription_status: subscriptionStatus,
        status: "active"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type,
        action: "broker_subscription_updated",
        stripe_status: stripeStatus,
        result
      });
    }

    return json(res, 200, {
      ok: true,
      received: true,
      ignored: true,
      type
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Stripe webhook failed."
    });
  }
}
