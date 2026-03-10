import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      return res.status(400).json({
        ok: false,
        error: "Missing token",
        alert_test_marker: "ADBS_ALERT_TEST_ACTIVE"
      });
    }

    const { data: link, error: linkError } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link) {
      console.error("submit_verify_check proof test: verify_links lookup failed", linkError);
      return res.status(404).json({
        ok: false,
        error: "Verification link not found",
        alert_test_marker: "ADBS_ALERT_TEST_ACTIVE"
      });
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
      console.error("submit_verify_check proof test: verify_checks insert failed", insertError);
      return res.status(500).json({
        ok: false,
        error: "Failed to save verification attempt",
        alert_test_marker: "ADBS_ALERT_TEST_ACTIVE",
        debug_route_check: "LIVE_PROOF_MARKER_INSERT_FAILED"
      });
    }

    return res.status(200).json({
      ok: true,
      result: resultCode,
      verdict,
      clear_to_load: isClear,
      caution_alert: !isClear,
      alert_test_marker: "ADBS_ALERT_TEST_ACTIVE",
      debug_route_check: "LIVE_PROOF_MARKER_SUCCESS"
    });
  } catch (err) {
    console.error("submit_verify_check proof test: unexpected error", err);
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error",
      detail: err?.message || String(err),
      alert_test_marker: "ADBS_ALERT_TEST_ACTIVE",
      debug_route_check: "LIVE_PROOF_MARKER_EXCEPTION"
    });
  }
}
