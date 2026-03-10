// /api/verify.js

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, entered_usdot, entered_plate, driver_answered } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  // Fetch verification link record
  const { data: link, error } = await supabase
    .from("verify_links")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !link) {
    return res.status(404).json({ error: "Verification link not found" });
  }

  // Normalize comparisons
  const enteredDOT = String(entered_usdot).replace(/\D/g, "");
  const enteredPlate = String(entered_plate).toUpperCase();

  const recordDOT = String(link.usdot_on_record).replace(/\D/g, "");
  const recordPlate = String(link.plate_on_record).toUpperCase();

  const dotMatch = enteredDOT === recordDOT;
  const plateMatch = enteredPlate === recordPlate;
  const phoneMatch = driver_answered === "YES";

  const result =
    dotMatch && plateMatch && phoneMatch
      ? "CLEAR_TO_LOAD"
      : "CAUTION_ALERT";

  // Log attempt
  await supabase.from("verify_checks").insert({
    token: token,
    entered_usdot: enteredDOT,
    entered_plate: enteredPlate,
    driver_answered: driver_answered,
    result: result,
    checked_at: new Date().toISOString()
  });

  // Count attempts
  const { data: attempts } = await supabase
    .from("verify_checks")
    .select("result")
    .eq("token", token);

  const failedAttempts = attempts.filter(
    (a) => a.result === "CAUTION_ALERT"
  ).length;

  // Trigger silent alert after 3 failures
  if (failedAttempts >= 3) {

    const alertEmail =
      link.issuer_email ||
      process.env.ADBS_ALERT_EMAIL;

    if (alertEmail) {
      try {
        await resend.emails.send({
          from: process.env.ADBS_EMAIL_FROM,
          to: alertEmail,
          subject: "AdbS Fraud Alert — Multiple Failed Verification Attempts",
          html: `
            <h2>AdbS Alert</h2>

            <p>Multiple failed Truck-Driver verification attempts detected.</p>

            <b>Load ID:</b> ${link.load_id}<br/>
            <b>Verification Token:</b> ${token}<br/>
            <b>Failed Attempts:</b> ${failedAttempts}<br/>
            <b>Time:</b> ${new Date().toLocaleString()}<br/><br/>

            <b>Verify Page:</b><br/>
            https://quecabadbs.com/v.html?t=${token}
          `
        });
      } catch (err) {
        console.error("Silent alert email failed:", err);
      }
    }

  }

  return res.status(200).json({
    result
  });

}
