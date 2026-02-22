// /api/submit_verify_check.js
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

function upper(s) {
  return String(s || "").trim().toUpperCase();
}

function inWindow(now, startsAt, expiresAt) {
  const n = now.getTime();
  const s = startsAt ? new Date(startsAt).getTime() : null;
  const e = expiresAt ? new Date(expiresAt).getTime() : null;
  if (s && n < s) return false;
  if (e && n > e) return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = req.body || {};
    const token = String(body.token || "").trim();
    const entered_usdot = upper(body.entered_usdot);
    const entered_plate = upper(body.entered_plate);
    const driver_answered = String(body.driver_answered || "").toUpperCase(); // YES/NO

    if (!token) return json(res, 400, { error: "token required" });
    if (!entered_usdot) return json(res, 400, { error: "entered_usdot required" });
    if (!entered_plate) return json(res, 400, { error: "entered_plate required" });
    if (driver_answered !== "YES" && driver_answered !== "NO")
      return json(res, 400, { error: "driver_answered must be YES or NO" });

    const { data: link, error: lerr } = await supabase
      .from("verify_links")
      .select("token, load_id, usdot_on_record, plate_on_record, status, starts_at, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (lerr) return json(res, 500, { error: lerr.message });
    if (!link) return json(res, 404, { error: "Not found" });

    if (String(link.status || "").toLowerCase() !== "active") {
      return json(res, 404, { error: "Not found" }); // don’t leak status
    }

    const now = new Date();
    if (!inWindow(now, link.starts_at, link.expires_at)) {
      return json(res, 404, { error: "Not found" }); // treat as not found to outsiders
    }

    const usdotMatch = onlyDigits(entered_usdot) === onlyDigits(link.usdot_on_record);
    const plateMatch = upper(entered_plate) === upper(link.plate_on_record);
    const phoneMatch = driver_answered === "YES";

    const result = usdotMatch && plateMatch && phoneMatch ? "CLEAR" : "CAUTION";

    const { error: ierr } = await supabase.from("verify_checks").insert([
      {
        token,
        load_id: link.load_id || null,
        entered_usdot: entered_usdot,
        entered_plate: entered_plate,
        driver_answered: phoneMatch,
        result,
        checked_at: now.toISOString(),
      },
    ]);

    if (ierr) return json(res, 500, { error: ierr.message });

    return json(res, 200, {
      ok: true,
      result,
      details: {
        load_id: link.load_id || null,
        usdot_match: usdotMatch,
        plate_match: plateMatch,
        driver_answered: phoneMatch,
      },
    });
  } catch (e) {
    return json(res, 500, { error: "Server error" });
  }
}
