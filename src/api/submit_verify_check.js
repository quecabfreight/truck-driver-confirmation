// /src/api/submit_verify_check.js
import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function upperTrim(v) {
  return String(v || "").trim().toUpperCase();
}

function asBoolDriverAnswered(v) {
  // Accept: true/false, "YES"/"NO", "yes"/"no", 1/0, "1"/"0"
  if (typeof v === "boolean") return v;
  const s = String(v || "").trim().toLowerCase();
  if (s === "yes" || s === "y" || s === "true" || s === "1") return true;
  if (s === "no" || s === "n" || s === "false" || s === "0") return false;
  return null;
}

function nowIso() {
  return new Date().toISOString();
}

function isWithinWindow(startsAt, expiresAt) {
  // startsAt/expiresAt are stored with timezone in DB (timestamptz).
  // We treat expiresAt null as "no expire".
  const now = Date.now();
  const s = startsAt ? Date.parse(startsAt) : NaN;
  const e = expiresAt ? Date.parse(expiresAt) : NaN;

  if (!Number.isNaN(s) && now < s) return false;
  if (!Number.isNaN(e) && now > e) return false;
  return true;
}

function distinctFailureCount(rows) {
  // Unique key: entered_usdot + entered_plate + driver_answered
  const set = new Set();
  for (const r of rows || []) {
    const k = `${String(r.entered_usdot || "")}|${String(r.entered_plate || "")}|${
      r.driver_answered ? "1" : "0"
    }`;
    set.add(k);
  }
  return set.size;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Use POST." });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { ok: false, error: "Server missing Supabase env." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    body = {};
  }

  const token = String(body.token || "").trim();
  const enteredUsdotDigits = onlyDigits(body.entered_usdot);
  const enteredPlateUpper = upperTrim(body.entered_plate);
  const driverAnswered = asBoolDriverAnswered(body.driver_answered);

  if (!token) return json(res, 400, { ok: false, error: "Missing token." });
  if (!enteredUsdotDigits) return json(res, 400, { ok: false, error: "Enter USDOT#." });
  if (!enteredPlateUpper) return json(res, 400, { ok: false, error: "Enter Plate." });
  if (driverAnswered === null) {
    return json(res, 400, { ok: false, error: "Select Driver Answered YES or NO." });
  }

  const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // 1) Load link
  const { data: link, error: linkErr } = await sb
    .from("verify_links")
    .select("token, load_id, usdot_on_record, plate_on_record, driver_phone, status, starts_at, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (linkErr) return json(res, 500, { ok: false, error: "DB error loading link." });
  if (!link) return json(res, 404, { ok: false, error: "Verify link not found." });

  // 2) Validate link state
  const status = String(link.status || "").toLowerCase();
  if (status === "revoked") {
    return json(res, 403, { ok: false, error: "This verify link is revoked.", revoked: true });
  }
  if (!isWithinWindow(link.starts_at, link.expires_at)) {
    return json(res, 403, { ok: false, error: "This verify link is not active (not started or expired)." });
  }

  // 3) Option B dedupe:
  // If an identical attempt exists, return its result WITHOUT consuming another strike.
  const { data: prior, error: priorErr } = await sb
    .from("verify_checks")
    .select("id, result, created_at, checked_at")
    .eq("token", token)
    .eq("entered_usdot", enteredUsdotDigits)
    .eq("entered_plate", enteredPlateUpper)
    .eq("driver_answered", driverAnswered)
    .order("created_at", { ascending: false })
    .limit(1);

  if (priorErr) return json(res, 500, { ok: false, error: "DB error checking duplicates." });

  // Pre-compute current unique failure count (so UI can show remaining tries)
  const { data: failRowsPre, error: failPreErr } = await sb
    .from("verify_checks")
    .select("entered_usdot, entered_plate, driver_answered, result")
    .eq("token", token)
    .eq("result", "caution");

  if (failPreErr) return json(res, 500, { ok: false, error: "DB error reading attempts." });
  const uniqueFailsPre = distinctFailureCount(failRowsPre);
  const remainingPre = Math.max(0, 3 - uniqueFailsPre);

  if (prior && prior.length) {
    const priorResult = String(prior[0].result || "").toLowerCase();
    const revoked = remainingPre <= 0;
    return json(res, 200, {
      ok: true,
      token,
      load_id: link.load_id ?? null,
      result: priorResult === "clear" ? "clear" : "caution",
      deduped: true,
      attempts_remaining: priorResult === "clear" ? remainingPre : remainingPre,
      revoked: revoked,
      note: "Duplicate attempt did not consume another try.",
    });
  }

  // 4) Compute pass/fail WITHOUT revealing expected values
  const recordUsdotDigits = onlyDigits(link.usdot_on_record);
  const recordPlateUpper = upperTrim(link.plate_on_record);

  const pass =
    enteredUsdotDigits === recordUsdotDigits &&
    enteredPlateUpper === recordPlateUpper &&
    driverAnswered === true;

  const result = pass ? "clear" : "caution";

  // 5) Write check row
  const checkRow = {
    token,
    load_id: link.load_id ?? null,
    entered_usdot: enteredUsdotDigits,
    entered_plate: enteredPlateUpper,
    driver_answered: driverAnswered,
    result,
    checked_at: nowIso(),
  };

  const { error: insErr } = await sb.from("verify_checks").insert(checkRow);
  if (insErr) return json(res, 500, { ok: false, error: "DB error saving verification check." });

  // 6) Strike logic: after inserting, count UNIQUE failures; revoke if >= 3
  let revokedNow = false;
  let attemptsRemaining = remainingPre;

  if (result === "caution") {
    // Recount after insert
    const { data: failRows, error: failErr } = await sb
      .from("verify_checks")
      .select("entered_usdot, entered_plate, driver_answered, result")
      .eq("token", token)
      .eq("result", "caution");

    if (failErr) return json(res, 500, { ok: false, error: "DB error counting attempts." });

    const uniqueFails = distinctFailureCount(failRows);
    attemptsRemaining = Math.max(0, 3 - uniqueFails);

    if (uniqueFails >= 3) {
      revokedNow = true;
      await sb.from("verify_links").update({ status: "revoked" }).eq("token", token);
    }
  }

  return json(res, 200, {
    ok: true,
    token,
    load_id: link.load_id ?? null,
    result,
    deduped: false,
    attempts_remaining: attemptsRemaining,
    revoked: revokedNow,
  });
}
