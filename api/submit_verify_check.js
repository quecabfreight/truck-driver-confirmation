import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function upper(value) {
  return String(value || "").trim().toUpperCase();
}

function yesValue(value) {
  if (value === true) return true;
  const v = String(value || "").trim().toUpperCase();
  return v === "YES" || v === "Y" || v === "TRUE";
}

function pickFirst(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      return v;
    }
  }
  return "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

    const token = String(pickFirst(body.token, body.t)).trim();
    const entered_usdot = digitsOnly(
      pickFirst(body.entered_usdot, body.usdot, body.enteredUSDOT)
    );
    const entered_plate = upper(
      pickFirst(body.entered_plate, body.plate, body.enteredPlate)
    );
    const driver_answered = yesValue(
      pickFirst(body.driver_answered, body.driverAnswered, body.answered)
    );

    if (!token) {
      return res.status(400).json({ ok: false, error: "Missing token." });
    }

    const { data: link, error: linkError } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      return res.status(404).json({ ok: false, error: "Verification link not found." });
    }

    const usdot_match = entered_usdot === digitsOnly(link.usdot_on_record);
    const plate_match = entered_plate === upper(link.plate_on_record);
    const phone_match = driver_answered === true;

    const result = usdot_match && plate_match && phone_match ? "clear" : "caution";

    const insertPayload = {
      token,
      entered_usdot,
      entered_plate,
      driver_answered,
      result,
      checked_at: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from("verify_checks")
      .insert(insertPayload);

    if (insertError) {
      console.error("submit_verify_check insertError:", insertError);
      return res.status(500).json({
        ok: false,
        error: "Failed to save verification attempt.",
        detail: insertError.message || String(insertError)
      });
    }

    const { data: attempts, error: attemptsError } = await supabase
      .from("verify_checks")
      .select("result")
      .eq("token", token);

    if (attemptsError) {
      console.error("submit_verify_check attemptsError:", attemptsError);
      return res.status(500).json({
        ok: false,
        error: "Failed to count verification attempts.",
        detail: attemptsError.message || String(attemptsError)
      });
    }

    const failed_attempts_next = (attempts || []).filter((a) => {
      return String(a.result || "").trim().toLowerCase() === "caution";
    }).length;

    let alert_triggered = false;
    let alert_error = "";

    if (failed_attempts_next >= 3) {
      const alert_to = String(
        pickFirst(
          link.issuer_email,
          link.authorized_email,
          link.user_email,
          link.created_by_email,
          process.env.ADBS_ALERT_EMAIL
        )
      ).trim();

      if (!alert_to) {
        alert_error = "No alert recipient found.";
        console.error("submit_verify_check alert: no recipient");
      } else if (!process.env.RESEND_API_KEY) {
        alert_error = "Missing RESEND_API_KEY.";
        console.error("submit_verify_check alert: missing RESEND_API_KEY");
      } else if (!process.env.ADBS_EMAIL_FROM) {
        alert_error = "Missing ADBS_EMAIL_FROM.";
        console.error("submit_verify_check alert: missing ADBS_EMAIL_FROM");
      } else {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);

          const sendResult = await resend.emails.send({
            from: process.env.ADBS_EMAIL_FROM,
            to: alert_to,
            subject: `AdbS Fraud Alert — ${link.load_id || "Load"}`,
            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.5;">
                <h2>AdbS Fraud Alert</h2>
                <p>Three or more failed Truck-Driver verification attempts were recorded.</p>
                <p><strong>Load ID:</strong> ${link.load_id || "(none)"}</p>
                <p><strong>Failed Attempts:</strong> ${failed_attempts_next}</p>
                <p><strong>Token:</strong> ${token}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Verify URL:</strong><br/>https://quecabadbs.com/v.html?t=${token}</p>
              </div>
            `
          });

          if (sendResult && sendResult.error) {
            alert_error = sendResult.error.message || JSON.stringify(sendResult.error);
            console.error("submit_verify_check alert sendResult.error:", sendResult.error);
          } else {
            alert_triggered = true;
          }
        } catch (err) {
          alert_error = err?.message || String(err);
          console.error("submit_verify_check alert exception:", err);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      result,
      alert_triggered,
      failed_attempts: failed_attempts_next,
      load_id: link.load_id || null,
      note: alert_triggered
        ? "Silent alert triggered (3 failed attempts). Load should NOT be released."
        : "Verification recorded.",
      alert_error
    });
  } catch (err) {
    console.error("submit_verify_check unexpected:", err);
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error.",
      detail: err?.message || String(err)
    });
  }
}
