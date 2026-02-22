// /api/submit_verify_check.js
import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function up(s) {
  return String(s || "").toUpperCase().trim();
}

function nowIso() {
  return new Date().toISOString();
}

function inWindow(starts_at, expires_at) {
  const now = Date.now();
  const start = starts_at ? Date.parse(starts_at) : null;
  const exp = expires_at ? Date.parse(expires_at) : null;
  if (start && now < start) return false;
  if (exp && now > exp) return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, { ok: false, error: "Server missing Supabase env vars." });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const body = req.body || {};
    const token = String(body.token || "").trim();
    const entered_usdot = onlyDigits(body.entered_usdot);
    const entered_plate = up(body.entered_plate);
    const driver_answered = !!body.driver_answered;

    if (!token) return json(res, 400, { ok: false, error: "token is required" });
    if (!entered_usdot) return json(res, 400, { ok: false, error: "entered_usdot is required" });
    if (!entered_plate) return json(res, 400, { ok: false, error: "entered_plate is required" });

    // Load link
    const { data: link, error: linkErr } = await supabase
      .from("verify_links")
      .select("token, load_id, usdot_on_record, plate_on_record, driver_phone, status, starts_at, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (linkErr) return json(res, 500, { ok: false, error: linkErr.message });
    if (!link) return json(res, 404, { ok: false, error: "Verification not found." });

    if (String(link.status || "").toLowerCase() !== "active") {
      return json(res, 403, { ok: false, error: "Verification is not active.", locked: true, reasons: ["Link not active."] });
    }

    if (!inWindow(link.starts_at, link.expires_at)) {
      return json(res, 403, { ok: false, error: "Verification not currently valid.", locked: true, reasons: ["Outside start/expire window."] });
    }

    // Count existing failed attempts (caution results) for this token
    const { data: priorFails, error: failErr } = await supabase
      .from("verify_checks")
      .select("id")
      .eq("token", token)
      .eq("result", "caution");

    if (failErr) return json(res, 500, { ok: false, error: failErr.message });

    const failsSoFar = Array.isArray(priorFails) ? priorFails.length : 0;

    // If already locked by attempts, revoke immediately
    if (failsSoFar >= 3) {
      // Ensure status is revoked (idempotent)
      await supabase.from("verify_links").update({ status: "revoked" }).eq("token", token);
      return json(res, 403, {
        ok: false,
        locked: true,
        error: "CAUTION ALERT — DO NOT LOAD (Locked after failed attempts).",
        reasons: ["Too many unsuccessful attempts."],
        attempts_used: 3,
      });
    }

    const record_usdot = onlyDigits(link.usdot_on_record);
    const record_plate = up(link.plate_on_record);

    const usdot_match = entered_usdot === record_usdot;
    const plate_match = entered_plate === record_plate;

    const reasons = [];
    if (!usdot_match) reasons.push("USDOT mismatch.");
    if (!plate_match) reasons.push("Plate mismatch.");
    if (!driver_answered) reasons.push("Driver did not answer phone.");

    const verdict = usdot_match && plate_match && driver_answered ? "clear" : "caution";

    // Insert check
    const row = {
      token,
      load_id: link.load_id || null,
      entered_usdot,
      entered_plate,
      driver_answered,
      result: verdict,
      checked_at: nowIso(),
    };

    const { error: insErr } = await supabase.from("verify_checks").insert(row);
    if (insErr) return json(res, 500, { ok: false, error: insErr.message });

    // If this was a failure, see if we hit strike 3
    let attempts_used = failsSoFar;
    let locked = false;

    if (verdict === "caution") {
      attempts_used = failsSoFar + 1;
      if (attempts_used >= 3) {
        locked = true;
        await supabase.from("verify_links").update({ status: "revoked" }).eq("token", token);
        reasons.unshift("Locked after 3 unsuccessful attempts.");
      }
    }

    return json(res, 200, {
      ok: true,
      verdict: locked ? "caution" : verdict,
      locked,
      attempts_used: verdict === "caution" ? Math.min(attempts_used, 3) : attempts_used,
      reasons,
    });
  } catch {
    return json(res, 500, { ok: false, error: "Server error submitting verification." });
  }
}
