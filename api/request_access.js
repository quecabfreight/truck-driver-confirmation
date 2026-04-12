import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

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
  try {
    const from = process.env.ADBS_EMAIL_FROM;

    const html = `
      <div style="font-family: Arial, sans-serif; background:#0b0f14; color:#fff; padding:20px;">
        <h2>QueCab AdbS</h2>

        <p>Hello ${contactName || ""},</p>

        <p>Your access request has been received and is currently under review.</p>

        <p>You will be notified once your access has been approved.</p>

        <br/>

        <p style="color:#888;">
          QueCab AdbS — Verification happens before freight moves.
        </p>
      </div>
    `;

    const result = await resend.emails.send({
      from,
      to: toEmail,
      subject: "QueCab AdbS — Access Request Received",
      html
    });

    return result;
  } catch (err) {
    console.error("Email send failed:", err.message);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    const legal_business_name = safe(body.legal_name || body.legal_business_name);
    const contact_name = safe(body.contact_name);
    const business_email = normalizeEmail(body.business_email || body.email);
    const business_phone = formatPhone(body.business_phone || body.phone);
    const mc_number = digits(body.mc_number || body.mc);
    const ein = safe(body.ein);
    const role = "broker";

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
      approved: false
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

    // 🔥 SEND EMAIL HERE (NEW)
    await sendRequestReceivedEmail(business_email, contact_name);

    return json(res, 200, {
      ok: true,
      message: "Access request submitted.",
      row: data
    });

  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
