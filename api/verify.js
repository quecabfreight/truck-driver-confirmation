// /api/verify.js

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

function normalizeDOT(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePlate(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeAnswered(value) {
  if (value === true) return true;
  const v = String(value || "").trim().toUpperCase();
  return v === "YES" || v === "Y" || v === "TRUE";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, entered_usdot, entered_plate, driver_answered } = req.body || {};

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const { data: link, error: linkError } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      console.error("verify.js: verify_links lookup failed", linkError);
      return res.status(404).json({ error: "Verification link not found" });
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

    const { error: insertError } = await supabase.from("verify_checks").insert({
      token,
      entered_usdot: enteredDOT,
      entered_plate: enteredPlate,
      driver_answered: phoneMatch,
      result,
      checked_at: new Date().toISOString()
    });

    if (insertError) {
      console.error("verify.js: verify_checks insert failed", insertError);
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
      console.error("verify.js: verify_checks read failed", attemptsError);
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
    let alertTo = null;
    let alertError = null;
    let resendData = null;

    if (failedAttempts === 3) {
      alertTriggered = true;

      const alertEmail =
        String(link.issuer_email || "").trim() ||
        String(process.env.ADBS_ALERT_EMAIL || "").trim() ||
        null;

      alertTo = alertEmail;

      if (!process.env.RESEND_API_KEY) {
        alertError = "Missing RESEND_API_KEY";
        console.error("verify.js: Missing RESEND_API_KEY");
      } else if (!process.env.ADBS_EMAIL_FROM) {
        alertError = "Missing ADBS_EMAIL_FROM";
        console.error("verify.js: Missing ADBS_EMAIL_FROM");
      } else if (!alertEmail) {
        alertError = "No alert recipient found (issuer_email and ADBS_ALERT_EMAIL are both empty)";
        console.error("verify.js: No alert recipient found");
      } else {
        try {
          console.log("verify.js: sending silent alert", {
            to: alertEmail,
            from: process.env.ADBS_EMAIL_FROM,
            load_id: link.load_id,
            token,
            failedAttempts
          });

          const sendResult = await resend.emails.send({
            from: process.env.ADBS_EMAIL_FROM,
            to: alertEmail,
            subject: "AdbS Fraud Alert — Multiple Failed Verification Attempts",
            html: `
              <h2>AdbS Alert</h2>
              <p>Multiple failed Truck-Driver verification attempts detected.</p>
              <p><strong>Load ID:</strong> ${link.load_id || "(none)"}</p>
              <p><strong>Verification Token:</strong> ${token}</p>
              <p><strong>Failed Attempts:</strong> ${failedAttempts}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Verify Page:</strong><br/>https://quecabadbs.com/v.html?t=${token}</p>
            `
          });

          resendData = sendResult;

          if (sendResult?.error) {
            alertError = sendResult.error.message || JSON.stringify(sendResult.error);
            console.error("verify.js: resend returned error", sendResult.error);
          } else {
            alertSent = true;
            console.log("verify.js: silent alert sent", sendResult);
          }
        } catch (err) {
          alertError = err?.message || String(err);
          console.error("verify.js: silent alert email failed", err);
        }
      }
    }

    return res.status(200).json({
      result,
      debug: {
        dotMatch,
        plateMatch,
        phoneMatch,
        failedAttempts,
        alertTriggered,
        alertSent,
        alertTo,
        alertError,
        resendData
      }
    });
  } catch (err) {
    console.error("verify.js: unexpected error", err);
    return res.status(500).json({
      error: "Unexpected verify error",
      detail: err?.message || String(err)
    });
  }
}
