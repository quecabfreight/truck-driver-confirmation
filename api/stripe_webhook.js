import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false
  }
};

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function clean(v) {
  return String(v || "").trim().toLowerCase();
}

async function activateAccount({ email, customerId, subscriptionId }) {
  const businessEmail = clean(email);

  if (!businessEmail) {
    return { ok: false, error: "Missing customer email." };
  }

  const { error } = await supabase
    .from("broker_accounts")
    .update({
      status: "active",
      subscription_status: "paid_active",
      plan_name: "founding_beta",
      monthly_verification_limit: 100,
      stripe_customer_id: customerId || null,
      stripe_subscription_id: subscriptionId || null,
      billing_started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("business_email", businessEmail)
    .neq("account_type", "internal");

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, business_email: businessEmail };
}

async function suspendByStripe({ customerId, subscriptionId, reason }) {
  let query = supabase
    .from("broker_accounts")
    .update({
      status: "suspended",
      subscription_status: reason || "billing_inactive",
      updated_at: new Date().toISOString()
    })
    .neq("account_type", "internal");

  if (subscriptionId) {
    query = query.eq("stripe_subscription_id", subscriptionId);
  } else if (customerId) {
    query = query.eq("stripe_customer_id", customerId);
  } else {
    return { ok: false, error: "Missing Stripe customer/subscription id." };
  }

  const { error } = await query;

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

async function activateFromSubscription(subscription) {
  const customerId = subscription.customer || "";
  const subscriptionId = subscription.id || "";

  const customer = await stripe.customers.retrieve(customerId);

  return activateAccount({
    email: customer?.email || "",
    customerId,
    subscriptionId
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers["stripe-signature"];
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    const event = stripe.webhooks.constructEvent(rawBody, sig, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const result = await activateAccount({
        email: session.customer_details?.email || session.customer_email || "",
        customerId: session.customer || "",
        subscriptionId: session.subscription || ""
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "checkout_activated",
        result
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const status = clean(subscription.status);

      if (status === "active" || status === "trialing") {
        const result = await activateFromSubscription(subscription);

        return json(res, 200, {
          ok: true,
          received: true,
          type: event.type,
          action: "subscription_active",
          stripe_status: status,
          result
        });
      }

      const result = await suspendByStripe({
        customerId: subscription.customer || "",
        subscriptionId: subscription.id || "",
        reason: status || "subscription_inactive"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "subscription_suspended",
        stripe_status: status,
        result
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const result = await suspendByStripe({
        customerId: subscription.customer || "",
        subscriptionId: subscription.id || "",
        reason: "canceled"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "subscription_canceled",
        result
      });
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      const result = await suspendByStripe({
        customerId: invoice.customer || "",
        subscriptionId: invoice.subscription || "",
        reason: "payment_failed"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "payment_failed",
        result
      });
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;

      if (!invoice.subscription) {
        return json(res, 200, {
          ok: true,
          received: true,
          type: event.type,
          ignored: true
        });
      }

      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const result = await activateFromSubscription(subscription);

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "invoice_paid_reactivated",
        result
      });
    }

    return json(res, 200, {
      ok: true,
      received: true,
      ignored: true,
      type: event.type
    });
  } catch (err) {
    return json(res, 400, {
      ok: false,
      error: err?.message || "Stripe webhook error"
    });
  }
}
