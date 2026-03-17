import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function onlyDigits(v) {
  return String(v || "").replace(/\D/g, "");
}

function upper(v) {
  return String(v || "").toUpperCase().trim();
}

function formatPhone(v) {
  const d = onlyDigits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`;
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
}

function bestPhone(link) {
  return (
    formatPhone(link?.driver_phone) ||
    formatPhone(link?.dispatch_phone) ||
    ""
  );
}

async function sendAlertEmail(token) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["quecabadbs@gmail.com"],   // 🔥 HARDWIRED — NO FAIL
        subject: "AdbS ALERT — 3 Failed Verification Attempts",
        html: `
          <h2>🚨 AdbS ALERT</h2>
          <p>3 failed Truck-Driver verification attempts detected.</p>
          <p><b>Verification ID:</b> ${token}</p>
          <p><a href="https://quecabadbs.com/v.html?t=${token}">
          Open Verification</a></p>
        `
      })
    });

    return await res.json();
  } catch (err) {
    return { error: err.message };
  }
}

export default async function handler(req, res) {
  try {
    const token =
      req.method === "GET"
        ? req.query.token
        : req.body.token;

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const { data: link } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .single();

    if (!link) {
      return res.status(404).json({ error: "Not found" });
    }

    const phone = bestPhone(link);

    // ---------- GET ----------
    if (req.method === "GET") {
      return res.status(200).json({
        ok: true,
        driver_phone: phone,
        verification_id: token,
        carrier_company: link.carrier_company || "",
        carrier_contact_name: link.dispatch_contact || "",
        carrier_contact_phone: formatPhone(link.dispatch_phone || "")
      });
    }

    // ---------- POST ----------
    const enteredDOT = onlyDigits(req.body.entered_usdot);
    const enteredPlate = upper(req.body.entered_plate);
    const driverAnswered = !!req.body.driver_answered;

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

    // 🔥 COUNT FAILS
    const { data: attempts } = await supabase
      .from("verify_checks")
      .select("result")
      .eq("token", token);

    const fails = (attempts || []).filter(
      (a) => a.result === "CAUTION_ALERT"
    ).length;

    // 🔥 FORCE ALERT
    if (fails === 3) {
      await sendAlertEmail(token);
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
      carrier_contact_phone: formatPhone(link.dispatch_phone || "")
    });
  } catch (err) {
    return res.status(500).json({
      error: "verify failed",
      detail: err.message
    });
  }
}
