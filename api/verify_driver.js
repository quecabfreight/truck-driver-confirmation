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

function normalizeDOT(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePlate(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeAnswered(value) {
  if (value === true) return true;
  if (value === false) return false;
  const v = String(value || "").trim().toUpperCase();
  return v === "YES" || v === "Y" || v === "TRUE";
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhoneHyphen(value) {
  const d = digitsOnly(value).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function bestPhone(link) {
  const driver = formatPhoneHyphen(link?.driver_phone || "");
  const dispatch = formatPhoneHyphen(link?.dispatch_phone || "");
  return driver || dispatch || "";
}

async function sendFraudAlert(link, token, failedAttempts) {
  try {
    const alertEmail =
      String(link?.issuer_email || "").trim() ||
      String(process.env.ADBS_ALERT_EMAIL || "").trim();

    if (!alertEmail) {
      return { ok: false, error: "Missing alert recipient (issuer_email / ADBS_ALERT_EMAIL)" };
    }

    if (!process.env.ADBS_EMAIL_FROM) {
      return { ok: false, error: "Missing ADBS_EMAIL_FROM" };
    }

    const resend = getResend();
    if (!resend) {
      return { ok: false, error: "Missing RESEND_API_KEY" };
    }

    const sendResult = await resend.emails.send({
      from: process.env.ADBS_EMAIL_FROM,
      to: alertEmail,
      subject: "AdbS Fraud Alert — Multiple Failed Verification Attempts",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111;">
          <h2>AdbS Alert</h2>
          <p>Multiple failed Truck-Driver verification attempts were detected.</p>
          <p><strong>Load ID:</strong> ${link?.load_id || "(none)"}</p>
          <p><strong>Verification ID:</strong> ${token}</p>
          <p><strong>Failed Attempts:</strong> ${failedAttempts}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Verify Page:</strong><br/>https://quecabadbs.com/v.html?t=${token}</p>
        </div>
      `
    });

    if (sendResult?.error) {
      return {
        ok: false,
        error: sendResult.error.message || JSON.stringify(sendResult.error)
      };
    }

    return {
      ok: true,
      data: sendResult
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || String(err)
    };
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

      return res.status(200).json({
        ok: true,
        driver_phone: bestPhone(link),
        carrier_company: String(link.carrier_company || ""),
        carrier_contact_name: String(link.dispatch_contact || ""),
        carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || ""),
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
    const { token, entered_usdot, entered_plate, driver_answered } = req.body || {};

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

    if (
      String(link.status || "").toLowerCase() === "cleared" ||
      String(link.status || "").toLowerCase() === "used"
    ) {
      return res.status(200).json({
        result: "CLEAR_TO_LOAD",
        verification_id: token,
        verified_at: link.cleared_at || "",
        driver_phone: phone,
        carrier_company: String(link.carrier_company || ""),
        carrier_contact_name: String(link.dispatch_contact || ""),
        carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || "")
      });
    }

    const enteredDOT = normalizeDOT(entered_usdot);
    const enteredPlate = normalizePlate(entered_plate);
    const recordDOT = normalizeDOT(link.usdot_on_record);
    const recordPlate = normalizePlate(link.plate_on_record);
    const phoneMatch = normalizeAnswered(driver_answered);

    const dotMatch = enteredDOT === recordDOT;
    const plateMatch = enteredPlate === recordPlate;

    const result =
      dotMatch && plateMatch && phoneMatch
        ? "CLEAR_TO_LOAD"
        : "CAUTION_ALERT";

    const nowIso = new Date().toISOString();

    const { error: insertError } = await supabase.from("verify_checks").insert({
      token,
      entered_usdot: enteredDOT,
      entered_plate: enteredPlate,
      driver_answered: phoneMatch,
      result,
      checked_at: nowIso
    });

    if (insertError) {
      return res.status(500).json({
        error: "Failed to log verification attempt",
        detail: insertError.message || String(insertError)
      });
    }

    const { data: attempts, error: attemptsError } = await supabase
      .from("verify_checks")
      .select("result, checked_at")
      .eq("token", token)
      .order("checked_at", { ascending: true });

    if (attemptsError) {
      return res.status(500).json({
        error: "Failed to read verification attempts",
        detail: attemptsError.message || String(attemptsError)
      });
    }

    const failedAttempts = (attempts || []).filter(
      (a) => a.result === "CAUTION_ALERT"
    ).length;

    let alertTriggered = false;
    let alertSent = false;
    let alertError = null;

    if (failedAttempts === 3) {
      alertTriggered = true;

      const alertResult = await sendFraudAlert(link, token, failedAttempts);

      alertSent = !!alertResult.ok;
      alertError = alertResult.ok ? null : alertResult.error || "Alert send failed";
    }

    if (result === "CLEAR_TO_LOAD") {
      await supabase
        .from("verify_links")
        .update({
          status: "cleared",
          cleared_at: nowIso
        })
        .eq("token", token);
    }

    return res.status(200).json({
      result,
      verification_id: token,
      verified_at: new Date(nowIso).toLocaleString(),
      driver_phone: phone,
      carrier_company: String(link.carrier_company || ""),
      carrier_contact_name: String(link.dispatch_contact || ""),
      carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || ""),
      debug: {
        dotMatch,
        plateMatch,
        phoneMatch,
        failedAttempts,
        alertTriggered,
        alertSent,
        alertError
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected verify error",
      detail: err?.message || String(err)
    });
  }
}
