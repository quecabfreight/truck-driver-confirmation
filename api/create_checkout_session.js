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
    const priceId = safe(process.env.STRIPE_PRICE_FOUNDING_BETA);

    if (!secretKey) {
      return json(res, 500, {
        ok: false,
        error: "Missing STRIPE_SECRET_KEY in Vercel."
      });
    }

    if (!priceId) {
      return json(res, 500, {
        ok: false,
        error: "Missing STRIPE_PRICE_FOUNDING_BETA in Vercel."
      });
    }

    const email = normalizeEmail(body.email);
    const plan = safe(body.plan || "founding_beta");

    if (!email || !email.includes("@")) {
      return json(res, 400, {
        ok: false,
        error: "Missing valid broker email."
      });
    }

    if (plan !== "founding_beta") {
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
