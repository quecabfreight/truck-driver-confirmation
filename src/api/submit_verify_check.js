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

function pickFirst(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    const token = pickFirst(body.token, body.t);
    const enteredUSDOT = normalizeDOT(
      pickFirst(body.entered_usdot, body.usdot, body.enteredUSDOT)
    );
    const enteredPlate = normalizePlate(
      pickFirst(body.entered_plate, body.plate, body.enteredPlate)
    );
    const driverAnsweredRaw = pickFirst(
      body.driver_answered,
      body.driverAnswered,
      body.answered
    );
    const driverAnswered = normalizeAnswered(driverAnsweredRaw);

    if (!token) {
      return res.status(400).json({ ok: false, error: "Missing token" });
    }

    const { data: link, error: linkError } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      console.error("submit_verify_check: verify_links lookup failed", linkError);
      return res.status(404).json({ ok: false, error: "Verification link not found" });
    }

    const recordDOT = normalizeDOT(link.usdot_on_record);
    const recordPlate = normalizePlate(link.plate_on_record);

    const dotMatch = enteredUSDOT === recordDOT;
    const plateMatch = enteredPlate === recordPlate;
    const phoneMatch = driverAnswered === true;

    const isClear = dotMatch && plateMatch && phoneMatch;

    const resultCode = isClear ? "clear" : "caution";
    const verdict = isClear ? "CLEAR TO LOAD" : "CAUTION ALERT — DO NOT LOAD";

    const { error: insertError } = await supabase.from("verify_checks").insert({
      token,
      entered_usdot: enteredUSDOT,
      entered_plate: enteredPlate,
      driver_answered: driverAnswered,
      result: resultCode,
      checked_at: new Date().toISOString()
    });

    if (insertError) {
      console.error("submit_verify_check: verify_checks insert failed", insertError);
      return res.status(500).json({
        ok: false,
        error: "Failed to save verification attempt"
      });
    }

    let alertSent = false;
    let alertError = "";
    let alertTo = "";

    // TEMP TEST MODE:
    // send alert on EVERY caution result so we can prove the alert path works
    if (!isClear) {
      const alertEmail = pickFirst(
        link.issuer_email,
        link.authorized_email,
        link.user_email,
        link.created_by_email,
        process.env.ADBS_ALERT_EMAIL
      );

      alertTo = String(alertEmail || "").trim();

      if (!process.env.RESEND_API_KEY) {
        alertError = "Missing RESEND_API_KEY";
        console.error("submit_verify_check: Missing RESEND_API_KEY");
      } else if (!process.env.ADBS_EMAIL_FROM) {
        alertError = "Missing ADBS_EMAIL_FROM";
        console.error("submit_verify_check: Missing ADBS_EMAIL_FROM");
      } else if (!alertTo) {
        alertError = "No alert recipient found";
        console.error("submit_verify_check: No alert recipient found");
      } else {
        try {
          const emailResult = await resend.emails.send({
            from: process.env.ADBS_EMAIL_FROM,
            to: alertTo,
            subject: "TEST ALERT — AdbS Caution Triggered",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2>AdbS Test Alert</h2>
                <p>This is a temporary test-mode alert.</p>
                <p>A caution result was triggered on the verification page.</p>

                <p><strong>Load ID:</strong> ${link.load_id || "(none)"}</p>
                <p><strong>Verification Token:</strong> ${token}</p>
                <p><strong>Entered USDOT:</strong> ${enteredUSDOT}</p>
                <p><strong>Entered Plate:</strong> ${enteredPlate}</p>
                <p><strong>Driver Answered:</strong> ${driverAnswered ? "YES" : "NO"}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>

                <p><strong>Verify URL:</strong><br/>
                https://quecabadbs.com/v.html?t=${token}</p>
              </div>
            `
          });

          if (emailResult?.error) {
            alertError =
              emailResult.error.message || JSON.stringify(emailResult.error);
            console.error("submit_verify_check: resend returned error", emailResult.error);
          } else {
            alertSent = true;
            console.log("submit_verify_check: test alert sent", {
              to: alertTo,
              load_id: link.load_id
            });
          }
        } catch (err) {
          alertError = err?.message || String(err);
          console.error("submit_verify_check: test alert send failed", err);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      result: resultCode,
      verdict,
      clear_to_load: isClear,
      caution_alert: !isClear,
      alert_sent: alertSent,
      alert_to: alertTo,
      alert_error: alertError
    });
  } catch (err) {
    console.error("submit_verify_check: unexpected error", err);
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error",
      detail: err?.message || String(err)
    });
  }
}
