import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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
  if (req.method === "GET") {
    return json(res, 200, {
      ok: true,
      message: "billing portal function is alive"
    });
  }

  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeKey) return json(res, 500, { ok: false, error: "Missing STRIPE_SECRET_KEY" });
    if (!supabaseUrl) return json(res, 500, { ok: false, error: "Missing SUPABASE_URL" });
    if (!supabaseKey) return json(res, 500, { ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" });

    const stripe = new Stripe(stripeKey);
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const email = normalizeEmail(body.email);

    if (!email) {
      return json(res, 400, { ok: false, error: "Missing email." });
    }

    const { data, error } = await supabase
      .from("broker_accounts")
      .select("business_email, stripe_customer_id")
      .eq("business_email", email)
      .maybeSingle();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Could not load broker account."
      });
    }

    if (!data) {
      return json(res, 404, { ok: false, error: "Broker account not found." });
    }

    if (!data.stripe_customer_id) {
      return json(res, 400, {
        ok: false,
        error: "No Stripe customer is attached to this broker account yet."
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: "https://quecabadbs.com/account"
    });

    return json(res, 200, {
      ok: true,
      url: session.url
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Could not create billing portal session."
    });
  }
}
