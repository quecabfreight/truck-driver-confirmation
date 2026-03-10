/api/verify.js

Paste this entire file.

:::
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

// fetch verification record
const { data: link, error } = await supabase
.from("verify_links")
.select("*")
.eq("token", token)
.single();

if (error || !link) {
return res.status(404).json({ error: "Verification link not found" });
}

const usdotMatch =
String(entered_usdot).replace(/\D/g, "") ===
String(link.usdot_on_record).replace(/\D/g, "");

const plateMatch =
String(entered_plate).toUpperCase() ===
String(link.plate_on_record).toUpperCase();

const phoneMatch = driver_answered === "YES";

const result = usdotMatch && plateMatch && phoneMatch
? "CLEAR_TO_LOAD"
: "CAUTION_ALERT";

// log verification attempt
await supabase.from("verify_checks").insert({
token: token,
entered_usdot,
entered_plate,
driver_answered,
result,
checked_at: new Date().toISOString()
});

// count failures
const { data: attempts } = await supabase
.from("verify_checks")
.select("*")
.eq("token", token);

const failedAttempts = attempts.filter(a => a.result === "CAUTION_ALERT").length;

// silent alert trigger
if (failedAttempts >= 3) {

const alertEmail = link.issuer_email || process.env.ADBS_ALERT_EMAIL;

try {
  await resend.emails.send({
    from: process.env.ADBS_EMAIL_FROM,
    to: alertEmail,
    subject: "AdbS Fraud Alert – Multiple Failed Verification Attempts",
    html: `
    <h2>AdbS Alert</h2>
    <p>Multiple failed verification attempts detected.</p>

    <b>Load ID:</b> ${link.load_id}<br/>
    <b>Token:</b> ${token}<br/>
    <b>Attempts:</b> ${failedAttempts}<br/>
    <b>Time:</b> ${new Date().toLocaleString()}
    `
  });
} catch (err) {
  console.error("Silent alert email failed", err);
}

}

return res.status(200).json({
result
});

}
:::
