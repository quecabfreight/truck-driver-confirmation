// /api/issue_verify_link.js
// Issues an AdbS verification link.
// IMPORTANT: converts datetime-local (no timezone) to a UTC ISO string before storing,
// so Supabase/Postgres doesn't incorrectly assume UTC for local times.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  return String(s || "").trim().toUpperCase();
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function token(n = 24) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// datetime-local like "2026-02-21T20:38" must be treated as LOCAL time.
// Convert to real UTC ISO string.
function localDatetimeToUtcIso(localStr) {
  if (!localStr) return null;
  // JS treats "YYYY-MM-DDTHH:mm" as local time in both browser + Node.
  const d = new Date(localStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString(); // UTC Z
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const load_id = String(body.load_id || "").trim();

    const usdot_on_record = onlyDigits(body.usdot_on_record);
    const plate_on_record = toUpperClean(body.plate_on_record);
    const driver_phone = formatPhoneHyphen(body.driver_phone);

    const mode = String(body.expire_mode || "AUTO_24H").toUpperCase(); // AUTO_24H | MANUAL | NO_EXPIRE

    const starts_at_utc =
      mode === "MANUAL" ? localDatetimeToUtcIso(body.starts_at) : new Date().toISOString();

    let expires_at_utc = null;
    if (mode === "NO_EXPIRE") {
      expires_at_utc = null;
    } else if (mode === "MANUAL") {
      expires_at_utc = localDatetimeToUtcIso(body.expires_at);
    } else {
      // AUTO_24H
      expires_at_utc = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    if (!load_id) return json(res, 400, { error: "Load ID is required." });
    if (!usdot_on_record) return json(res, 400, { error: "USDOT# (digits) is required." });
    if (!plate_on_record) return json(res, 400, { error: "Plate is required." });
    if (onlyDigits(driver_phone).length !== 10)
      return json(res, 400, { error: "Driver phone must be 10 digits." });

    if (!starts_at_utc) return json(res, 400, { error: "Invalid start time." });
    if (mode !== "NO_EXPIRE" && !expires_at_utc)
      return json(res, 400, { error: "Invalid expire time." });

    const t = token(24);

    const { error: insErr } = await supabase.from("verify_links").insert([
      {
        token: t,
        load_id,
        usdot_on_record,
        plate_on_record,
        driver_phone,
        status: "active",
        starts_at: starts_at_utc,
        expires_at: expires_at_utc,
      },
    ]);

    if (insErr) return json(res, 500, { error: insErr.message });

    const origin =
      (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
      (req.headers["x-forwarded-host"] || req.headers.host);

    const verify_url = `${origin}/#/verify/${t}`;

    return json(res, 200, {
      ok: true,
      token: t,
      verify_url,
      expires_at: expires_at_utc,
      starts_at: starts_at_utc,
    });
  } catch (e) {
    return json(res, 500, { error: "Server error issuing link." });
  }
}
