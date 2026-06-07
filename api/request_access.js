import { createClient } from "@supabase/supabase-js";
import { sendAdbsEmail, escapeHtml } from "./_sendAdbsEmail.js";

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
  return String(v ?? "").trim();
}

function digits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhone(v) {
  const d = digits(v).slice(0, 10);
  if (!d) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function normalizeEmail(v) {
  return safe(v).toLowerCase();
}

function betaAccepted(body) {
  return (
    body.accepted_beta_notice === true ||
    body.accepted_beta_notice === "true" ||
    body.beta_acknowledged === true ||
    body.beta_acknowledged === "true" ||
    body.beta_notice_acknowledged === true ||
    body.beta_notice_acknowledged === "true" ||
    body.beta_notice_accepted === true ||
    body.beta_notice_accepted === "true" ||
    body.accepted_beta === true ||
    body.accepted_beta === "true" ||
    body.beta_accepted === true ||
    body.beta_accepted === "true"
  );
}

async function sendRequestReceivedEmail(toEmail, contactName) {
  const name = contactName || "there";

  const html = `
    <div style="margin:0;padding:0;background:#0b111b;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:700px;margin:0 auto;padding:26px 18px;">
        <div style="text-align:center;margin-bottom:18px;">
          <img
            src="https://quecabadbs.com/qc-logo.png"
            alt="QueCab AdbS"
            style="max-width:220px;height:auto;"
          />
        </div>

        <div style="background:#101a28;border:1px solid rgba(255,255,255,0.14);border-radius:18px;padding:30px;">
          <div style="font-size:28px;font-weight:900;margin-bottom:6px;">
            Broker Access Request Received
          </div>

          <div style="color:#9fb2cc;font-size:14px;margin-bottom:24px;">
            QueCab AdbS™ — Anti-Double-Broker System
          </div>

          <p style="font-size:16px;line-height:1.7;color:#e7eef8;">
            Hello ${escapeHtml(name)},
          </p>

          <p style="font-size:16px;line-height:1.7;color:#e7eef8;">
            Thank you for your interest in QueCab AdbS™.
          </p>

          <p style="font-size:16px;line-height:1.7;color:#e7eef8;">
            Your broker access request has been successfully received and is currently under review.
          </p>

          <div style="
            margin:28px 0;
            padding:20px;
            background:#172436;
            border-radius:14px;
            border-left:4px solid #3d8cff;
          ">
            <div style="font-size:20px;font-weight:900;margin-bottom:14px;">
              What Happens Next?
            </div>

            <div style="margin-bottom:12px;color:#e7eef8;line-height:1.55;">
              <strong>1. Broker Review</strong><br/>
              We review the information submitted with your request.
            </div>

            <div style="margin-bottom:12px;color:#e7eef8;line-height:1.55;">
              <strong>2. Approval Decision</strong><br/>
              If approved, you will receive an approval email containing your QueCab AdbS access credentials.
            </div>

            <div style="margin-bottom:12px;color:#e7eef8;line-height:1.55;">
              <strong>3. Select Your Plan</strong><br/>
              Choose the subscription plan that best fits your operation.
            </div>

            <div style="color:#e7eef8;line-height:1.55;">
              <strong>4. Begin Verifying Loads</strong><br/>
              Issue Truck-Driver verifications, monitor activity, and help stop double brokering before freight gets loaded.
            </div>
          </div>

          <div style="
            margin-top:24px;
            padding:16px;
            background:#0f1825;
            border-radius:12px;
            color:#d6e4f5;
            line-height:1.6;
          ">
            <strong>Important:</strong><br/>
            Submitting a request does not activate a subscription and does not create billing charges.
            Subscriptions are only activated after broker approval and plan selection.
          </div>

          <div style="border-top:1px solid rgba(255,255,255,0.12);margin-top:28px;padding-top:18px;">
            <div style="font-size:18px;font-weight:900;">
              QueCab AdbS™
            </div>

            <div style="color:#9fb2cc;margin-top:4px;">
              Secure your load.
            </div>

            <div style="color:#9fb2cc;margin-top:4px;">
              Verification happens before freight moves.
            </div>

            <div style="color:#9fb2cc;font-size:13px;margin-top:16px;">
              © 2026 Omnimobile Inc. All Rights Reserved.<br/>
              Patent Pending.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const text = `
QueCab AdbS™

Broker Access Request Received

Hello ${name},

Thank you for your interest in QueCab AdbS™.

Your broker access request has been successfully received and is currently under review.

WHAT HAPPENS NEXT?

1. Broker Review
We review the information submitted with your request.

2. Approval Decision
If approved, you will receive an approval email containing your QueCab AdbS access credentials.

3. Select Your Plan
Choose the subscription plan that best fits your operation.

4. Begin Verifying Loads
Issue Truck-Driver verifications, monitor activity, and help stop double brokering before freight gets loaded.

IMPORTANT

Submitting a request does not activate a subscription and does not create billing charges.

Subscriptions are only activated after broker approval and plan selection.

QueCab AdbS™
Secure your load.
Verification happens before freight moves.

© 2026 Omnimobile Inc. All Rights Reserved.
Patent Pending.
  `.trim();

  return await sendAdbsEmail({
    to: toEmail,
    subject: "QueCab AdbS — Broker Access Request Received",
    html,
    text
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const legal_business_name = safe(
      body.legal_business_name ||
      body.legal_name ||
      body.business_name ||
      body.company_name
    );

    const contact_name = safe(body.contact_name);
    const business_email = normalizeEmail(body.business_email || body.email);
    const business_phone = formatPhone(body.business_phone || body.phone);
    const mc_number = digits(body.mc_number || body.mc);
    const role = "broker";
    const accepted = betaAccepted(body);

    if (!legal_business_name) {
      return json(res, 400, { ok: false, error: "Business name is required." });
    }

    if (!contact_name) {
      return json(res, 400, { ok: false, error: "Contact name is required." });
    }

    if (!business_email) {
      return json(res, 400, { ok: false, error: "Business email is required." });
    }

    if (!business_phone) {
      return json(res, 400, { ok: false, error: "Business phone is required." });
    }

    if (!mc_number) {
      return json(res, 400, { ok: false, error: "MC number is required." });
    }

    if (!accepted) {
      return json(res, 400, {
        ok: false,
        error: "Beta notice acknowledgment is required."
      });
    }

    const payload = {
      legal_business_name,
      contact_name,
      role,
      mc_number,
      business_phone,
      business_email,
      beta_acknowledged: true,
      status: "new"
    };

    const { data, error } = await supabase
      .from("beta_requests")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Could not save access request."
      });
    }

    const emailResult = await sendRequestReceivedEmail(
      business_email,
      contact_name
    );

    return json(res, 200, {
      ok: true,
      message: "Access request submitted.",
      row: data,
      email_status: emailResult.ok ? "sent" : "not_sent",
      email_error: emailResult.ok ? null : emailResult.error
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
