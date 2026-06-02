import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

export const config = {
  api: {
    bodyParser: false
  }
};

async function getRawBody(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    readable.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    readable.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    readable.on("error", reject);
  });
}

async function activateBrokerAccount({
  email,
  customerId,
  subscriptionId
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const payload = {
    subscription_status: "paid_active",
    status: "active",
    stripe_customer_id: customerId || null,
    stripe_subscription_id: subscriptionId || null,
    billing_started_at: new Date().toISOString()
  };

  const result = await supabase
    .from("broker_accounts")
    .update(payload)
    .eq("business_email", normalizedEmail);

  return {
    ok: !result.error,
    error: result.error?.message || null
  };
}

async function suspendBrokerAccount({
  customerId,
  subscriptionId,
  reason = "subscription_inactive"
}) {
  let query = supabase
    .from("broker_accounts")
    .update({
      subscription_status: reason,
      status: "suspended"
    });

  if (subscriptionId) {
    query = query.eq("stripe_subscription_id", subscriptionId);
  } else {
    query = query.eq("stripe_customer_id", customerId);
  }

  const result = await query;

  return {
    ok: !result.error,
    error: result.error?.message || null
  };
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

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );

    //
    // CHECKOUT COMPLETED
    //
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        "";

      const customerId = session.customer || "";
      const subscriptionId = session.subscription || "";

      const result = await activateBrokerAccount({
        email: customerEmail,
        customerId,
        subscriptionId
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "broker_subscription_activated",
        result
      });
    }

    //
    // SUBSCRIPTION UPDATED
    //
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;

      const customerId = subscription.customer || "";
      const subscriptionId = subscription.id || "";
      const status = String(subscription.status || "").toLowerCase();

      if (
        status === "active" ||
        status === "trialing"
      ) {
        const customer = await stripe.customers.retrieve(customerId);

        const result = await activateBrokerAccount({
          email: customer.email,
          customerId,
          subscriptionId
        });

        return json(res, 200, {
          ok: true,
          received: true,
          type: event.type,
          action: "subscription_reactivated",
          result
        });
      }

      const result = await suspendBrokerAccount({
        customerId,
        subscriptionId,
        reason: status
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "subscription_suspended",
        result
      });
    }

    //
    // SUBSCRIPTION DELETED
    //
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      const result = await suspendBrokerAccount({
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

    //
    // PAYMENT FAILED
    //
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      const result = await suspendBrokerAccount({
        customerId: invoice.customer || "",
        subscriptionId: invoice.subscription || "",
        reason: "payment_failed"
      });

      return json(res, 200, {
        ok: true,
        received: true,
        type: event.type,
        action: "payment_failed_account_suspended",
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
      error: err?.message || "Webhook error"
    });
  }
}
