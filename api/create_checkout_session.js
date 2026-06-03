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

const PLAN_PRICE_IDS = {
  founding_beta: "price_1TdB7sFRmRC6j774Ac8mUngM",
  starter: "price_1Tdv4VFRmRC6j774PU5MuqHv",
  growth: "price_1Tdv71FRmRC6j774yHconv6r",
  pro: "price_1Tdv97FRmRC6j774Nwvx2DAT",
  scale: "price_1TdvAMFRmRC6j774Y3sQBpkS"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed"
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

  try {
    const secretKey = safe(process.env.STRIPE_SECRET_KEY);

    if (!secretKey) {
      return json(res, 500, {
        ok: false,
        error: "Missing STRIPE_SECRET_KEY in Vercel."
      });
    }

    const email = normalizeEmail(body.email);
    const plan = safe(body.plan || "founding_beta").toLowerCase();
    const priceId = PLAN_PRICE_IDS[plan];

    if (!email || !email.includes("@")) {
      return json(res, 400, {
        ok: false,
        error: "Missing valid broker email."
      });
    }

    if (!priceId) {
      return json(res, 400, {
        ok: false,
        error: "Unsupported plan."
      });
    }

    const params = new URLSearchParams();

    params.append("mode", "subscription");
    params.append("customer_email", email);
    params.append("line_items[0][price]", priceId);
    params.append("line_items[0][quantity]", "1");
    params.append("metadata[plan]", plan);
    params.append("subscription_data[metadata][plan]", plan);

    params.append(
      "success_url",
      "https://quecabadbs.com/billing-success.html?session_id={CHECKOUT_SESSION_ID}"
    );

    params.append(
      "cancel_url",
      "https://quecabadbs.com/billing-cancel.html"
    );

    const stripeRes = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      }
    );

    const stripeText = await stripeRes.text();

    let stripeData = {};

    try {
      stripeData = JSON.parse(stripeText || "{}");
    } catch {
      stripeData = {};
    }

    if (!stripeRes.ok) {
      return json(res, 500, {
        ok: false,
        error:
          stripeData?.error?.message ||
          stripeText ||
          "Stripe checkout session could not be created."
      });
    }

    return json(res, 200, {
      ok: true,
      plan,
      price_id: priceId,
      checkout_url: stripeData.url,
      session_id: stripeData.id
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Checkout session failed."
    });
  }
}
