import { createClient } from "@supabase/supabase-js";
import { sendAdbsEmail, escapeHtml } from "./_sendAdbsEmail.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
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

async function sendRequestReceivedEmail(toEmail, contactName) {
  const name = contactName || "there";

  const html = `
    <div style="margin:0;padding:0;background:#0b111b;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;padding:26px 18px;">
        <div style="background:#101a28;border:1px solid rgba(255,255,255,0.14);border-radius:18px;padding:26px;">
          <div style="font-size:26px;font-weight:900;margin-bottom:4px;">QueCab AdbS</div>
          <div style="color:#9fb2cc;font-size:14px;margin-bottom:24px;">Anti-Double-Broker System</div>

          <div style="font-size:22px;font-weight:900;margin-bottom:14px;">
            Access Request Received
          </div>

          <p style="font-size:15px;line-height:1.65;color:#e7eef8;">
            Hello ${escapeHtml(name)},
          </p>

          <p style="font-size:15px;line-height:1.65;color:#e7eef8;">
            Your access request has been received and is currently under review.
          </p>

          <p style="font-size:15px;line-height:1.65;color:#e7eef8;">
            You will be notified once your access has been approved.
          </p>

          <div style="border-top:1px solid rgba(255,255,255,0.12);margin-top:24px;padding-top:16px;color:#9fb2cc;font-size:13px;line-height:1.6;">
            QueCab AdbS™ — Verification happens before freight moves.<br/>
            © 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
          </div>
        </div>
      </div>
    </div>
  `;

  const text = `
QueCab AdbS — Access Request Received

Hello ${name},

Your access request has been received and is currently under review.

You will be notified once your access has been approved.

QueCab AdbS — Verification happens before freight moves.
© 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
  `.trim();

  return await sendAdbsEmail({
    to: toEmail,
    subject: "QueCab AdbS — Access Request Received",
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

    const legal_business_name = safe(body.legal_name || body.legal_business_name);
    const contact_name = safe(body.contact_name);
    const business_email = normalizeEmail(body.business_email || body.email);
    const business_phone = formatPhone(body.business_phone || body.phone);
    const mc_number = digits(body.mc_number || body.mc);
    const ein = safe(body.ein);
    const role = "broker";

    const accepted_beta_notice =
      body.accepted_beta_notice === true ||
      body.accepted_beta_notice === "true";

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

    if (!accepted_beta_notice) {
      return json(res, 400, {
        ok: false,
        error: "Beta notice acknowledgment is required."
      });
    }

    const payload = {
      legal_business_name,
      contact_name,
      business_email,
      email: business_email,
      business_phone,
      mc_number,
      ein: ein || null,
      role,
      status: "pending",
      approved: false,
      accepted_beta_notice: true,
      accepted_beta_notice_at: new Date().toISOString()
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
