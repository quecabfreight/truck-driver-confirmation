import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function upper(v) {
  return String(v || "").toUpperCase().trim();
}

function formatPhone(v) {
  const d = onlyDigits(v).slice(0, 10);
  if (!d) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function bestPhone(link) {
  return formatPhone(link?.driver_phone) || formatPhone(link?.dispatch_phone) || "";
}

async function sendAlertEmail(link, token, failedAttempts) {
  try {
    const resend = getResend();
    if (!resend) {
      return { ok: false, error: "Missing RESEND_API_KEY" };
    }

    const toEmail =
      String(process.env.ADBS_ALERT_EMAIL || "").trim() ||
      "quecabadbs@gmail.com";

    const fromEmail = process.env.ADBS_EMAIL_FROM || "onboarding@resend.dev";

    const loadId = String(link?.load_id || "").trim() || "(none)";
    const carrierCompany = String(link?.carrier_company || "").trim() || "(not provided)";
    const carrierContact = String(link?.dispatch_contact || "").trim() || "(not provided)";
    const carrierPhone = formatPhone(link?.dispatch_phone || "") || "(not provided)";

    const sendResult = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: "AdbS ALERT — 3 Failed Verification Attempts",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111;">
          <h2>AdbS Alert</h2>
          <p>Three failed Truck-Driver verification attempts were detected.</p>

          <p><strong>Load ID:</strong> ${loadId}</p>
          <p><strong>Verification ID:</strong> ${token}</p>
          <p><strong>Failed Attempts:</strong> ${failedAttempts}</p>

          <hr style="margin:18px 0; border:none; border-top:1px solid #ddd;" />

          <p><strong>Carrier Company:</strong> ${carrierCompany}</p>
          <p><strong>Carrier Contact:</strong> ${carrierContact}</p>
          <p><strong>Carrier Contact Phone:</strong> ${carrierPhone}</p>

          <hr style="margin:18px 0; border:none; border-top:1px solid #ddd;" />

          <p><strong>Next Step:</strong></p>
          <p>Open Control Center and search this Verification ID:</p>
          <p style="font-size:18px; font-weight:800;">${token}</p>

          <p style="margin-top:18px;">
            <a href="https://quecabadbs.com/" style="display:inline-block;padding:10px 14px;background:#1f4f8a;color:#fff;text-decoration:none;border-radius:8px;">
              Open Control Center
            </a>
          </p>
        </div>
      `
    });

    if (sendResult?.error) {
      return {
        ok: false,
        error: sendResult.error.message || JSON.stringify(sendResult.error)
      };
    }

    return { ok: true, data: sendResult };
  } catch (err) {
    return { ok: false, error: err?.message || String(err) };
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const token = String(req.query?.token || "").trim();

      if (!token) {
        return res.status(400).json({ error: "Missing token" });
      }

      const { data: link, error } = await supabase
        .from("verify_links")
        .select("token,driver_phone,dispatch_phone,carrier_company,dispatch_contact")
        .eq("token", token)
        .maybeSingle();

      if (error) {
        return res.status(500).json({
          error: "Lookup failed",
          detail: error.message || String(error)
        });
      }

      if (!link) {
        return res.status(404).json({ error: "Verification link not found" });
      }

      return res.status(200).json({
        ok: true,
        driver_phone: bestPhone(link),
        carrier_company: String(link.carrier_company || ""),
        carrier_contact_name: String(link.dispatch_contact || ""),
        carrier_contact_phone: formatPhone(link.dispatch_phone || ""),
        verification_id: token
      });
    } catch (err) {
      return res.status(500).json({
        error: "Failed to load verification info",
        detail: err?.message || String(err)
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = String(req.body?.token || "").trim();
    const enteredDOT = onlyDigits(req.body?.entered_usdot);
    const enteredPlate = upper(req.body?.entered_plate);
    const driverAnswered = !!req.body?.driver_answered;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const { data: link, error } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: "Lookup failed",
        detail: error.message || String(error)
      });
    }

    if (!link) {
      return res.status(404).json({ error: "Verification link not found" });
    }

    const phone = bestPhone(link);

    if (String(link.status || "").toLowerCase() === "cleared") {
      return res.status(200).json({
        result: "CLEAR_TO_LOAD",
        verification_id: token,
        driver_phone: phone,
        verified_at: link.cleared_at || "",
        carrier_company: link.carrier_company || "",
        carrier_contact_name: link.dispatch_contact || "",
        carrier_contact_phone: formatPhone(link.dispatch_phone || "")
      });
    }

    const match =
      enteredDOT === onlyDigits(link.usdot_on_record) &&
      enteredPlate === upper(link.plate_on_record) &&
      driverAnswered;

    const result = match ? "CLEAR_TO_LOAD" : "CAUTION_ALERT";
    const now = new Date().toISOString();

    await supabase.from("verify_checks").insert({
      token,
      entered_usdot: enteredDOT,
      entered_plate: enteredPlate,
      driver_answered: driverAnswered,
      result,
      checked_at: now
    });

    const { data: attempts } = await supabase
      .from("verify_checks")
      .select("result")
      .eq("token", token);

    const fails = (attempts || []).filter(
      (a) => a.result === "CAUTION_ALERT"
    ).length;

    let alertTriggered = false;
    let alertSent = false;
    let alertError = null;

    if (fails === 3) {
      alertTriggered = true;
      const alertResult = await sendAlertEmail(link, token, fails);
      alertSent = !!alertResult.ok;
      alertError = alertResult.ok ? null : alertResult.error || "Alert send failed";
    }

    if (result === "CLEAR_TO_LOAD") {
      await supabase
        .from("verify_links")
        .update({ status: "cleared", cleared_at: now })
        .eq("token", token);
    }

    return res.status(200).json({
      result,
      verification_id: token,
      driver_phone: phone,
      verified_at: new Date().toLocaleString(),
      carrier_company: link.carrier_company || "",
      carrier_contact_name: link.dispatch_contact || "",
      carrier_contact_phone: formatPhone(link.dispatch_phone || ""),
      debug: {
        failedAttempts: fails,
        alertTriggered,
        alertSent,
        alertError
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "verify failed",
      detail: err.message
    });
  }
}
