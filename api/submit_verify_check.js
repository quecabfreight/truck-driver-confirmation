// /api/submit_verify_check.js
// Writes a verify_checks row, updates verify_links counters,
// and triggers a "silent alert" after 3 failed attempts.

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase().trim();
}

function nowIso() {
  return new Date().toISOString();
}

function isExpired(link) {
  const now = Date.now();
  const starts = link?.starts_at ? Date.parse(link.starts_at) : NaN;
  const expires = link?.expires_at ? Date.parse(link.expires_at) : NaN;

  if (!Number.isNaN(starts) && now < starts) return true;
  if (!Number.isNaN(expires) && now > expires) return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return json(res, 500, { ok: false, error: "Server missing Supabase env vars." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body." });
  }

  const token = String(body.token || "").trim();
  const entered_usdot = toUpperClean(body.entered_usdot);
  const entered_plate = toUpperClean(body.entered_plate);
  const driver_answered = !!body.driver_answered;

  if (!token) return json(res, 400, { ok: false, error: "Missing token." });
  if (!entered_usdot) return json(res, 400, { ok: false, error: "Enter DOT." });
  if (!entered_plate) return json(res, 400, { ok: false, error: "Enter Plate." });

  // 1) Fetch link by token
  let link = null;
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/verify_links?token=eq.${encodeURIComponent(token)}&select=*`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );

    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      const msg = data?.message || data?.error || `Supabase read failed (${r.status}).`;
      return json(res, 500, { ok: false, error: msg });
    }

    link = Array.isArray(data) ? data[0] : null;
    if (!link) return json(res, 404, { ok: false, error: "Verify link not found." });

    if (String(link.status || "").toLowerCase() !== "active") {
      return json(res, 403, { ok: false, error: "Verify link is not active." });
    }

    if (isExpired(link)) {
      return json(res, 403, { ok: false, error: "Verify link is not active (time window ended)." });
    }
  } catch {
    return json(res, 500, { ok: false, error: "Network error reading verify link." });
  }

  // 2) Compute pass/fail
  const on_usdot_digits = onlyDigits(link.usdot_on_record);
  const entered_usdot_digits = onlyDigits(entered_usdot);

  const on_plate = toUpperClean(link.plate_on_record);
  const entered_plate_clean = toUpperClean(entered_plate);

  const usdot_match = !!on_usdot_digits && (entered_usdot_digits === on_usdot_digits);
  const plate_match = !!on_plate && (entered_plate_clean === on_plate);

  // Your rule: final verdict is decided ONLY on submit.
  // Clear requires: DOT match AND Plate match AND driver answered YES.
  const verdict = (usdot_match && plate_match && driver_answered) ? "clear" : "caution";

  // 3) Insert verify_check row (audit log)
  const checkRow = {
    token,
    load_id: link.load_id || null,
    entered_usdot: entered_usdot,
    entered_plate: entered_plate,
    driver_answered: driver_answered,
    result: verdict,
    checked_at: nowIso(),
  };

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/verify_checks`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(checkRow),
    });

    const text = await r.text();
    let data = null;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!r.ok) {
      const msg = data?.message || data?.error || `Supabase insert failed (${r.status}).`;
      return json(res, 500, { ok: false, error: msg });
    }
  } catch {
    return json(res, 500, { ok: false, error: "Network error writing verify check." });
  }

  // 4) Update link fail counter + trigger "silent alert" after 3 failed attempts
  let alert_triggered = false;
  let failed_attempts_next = Number(link.failed_attempts || 0);

  if (verdict === "caution") {
    failed_attempts_next = failed_attempts_next + 1;

    const alreadySent = !!link.alert_sent;

    if (!alreadySent && failed_attempts_next >= 3) {
      alert_triggered = true;
    }

    const patch = {
      failed_attempts: failed_attempts_next,
      alert_sent: alreadySent ? true : (alert_triggered ? true : false),
      flagged_at: alert_triggered ? nowIso() : (link.flagged_at || null),
      // OPTIONAL: you can also set status="flagged" if you want a hard lock
      // status: alert_triggered ? "flagged" : "active",
    };

    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/verify_links?token=eq.${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(patch),
        }
      );

      const text = await r.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      if (!r.ok) {
        // Don't block dock flow if patch fails — still return verdict.
        // But surface debug to issuer later if needed.
      }
    } catch {
      // Same: don’t block dock flow.
    }
  }

  // 5) Return result
  // IMPORTANT: We are NOT revealing on-record DOT/Plate.
  // We only return verdict + whether alert was triggered.
  return json(res, 200, {
    ok: true,
    result: verdict,
    alert_triggered,
    failed_attempts: failed_attempts_next,
    load_id: link.load_id || null,
    note: alert_triggered
      ? "Silent alert triggered (3 failed attempts). Load should NOT be released."
      : "Verification recorded.",
  });
}
