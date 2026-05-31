import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function json(res, code, obj) {
  res.status(code);
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
    const plan = safe(body.plan || "founding_beta");

    if (!email || !email.includes("@")) {
      return json(res, 400, {
        ok: false,
        error: "Missing valid email."
      });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return json(res, 500, {
        ok: false,
        error: "Missing STRIPE_SECRET_KEY environment variable."
      });
    }

    const priceMap = {
      founding_beta: process.env.STRIPE_PRICE_FOUNDING_BETA
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return json(res, 500, {
        ok: false,
        error: `Missing Stripe price for plan: ${plan}`
      });
    }

    const baseUrl =
      process.env.ADBS_SITE_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      "https://quecabadbs.com";

    const cleanBaseUrl = baseUrl.startsWith("http")
      ? baseUrl
      : `https://${baseUrl}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url:
        `${cleanBaseUrl}/billing-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        `${cleanBaseUrl}/billing-cancel.html`,
      metadata: {
        plan,
        source: "quecab_adbs"
      },
      subscription_data: {
        metadata: {
          plan,
          source: "quecab_adbs"
        }
      },
      allow_promotion_codes: true
    });

    return json(res, 200, {
      ok: true,
      checkout_url: session.url,
      session_id: session.id
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Stripe checkout session failed."
    });
  }
}
