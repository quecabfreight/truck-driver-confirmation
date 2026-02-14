// api/verify_and_log_check.js
import { getAdmin, json, readJson } from "./_supabaseAdmin.js";

function upper(s) {
  return String(s || "").trim().toUpperCase();
}
function digits(s) {
  return String(s || "").replace(/\D/g, "").trim();
}
function isActive(link) {
  if (!link) return false;
  if (link.status && String(link.status).toLowerCase() !== "active") return false;

  const now = new Date();
  if (link.starts_at && new Date(link.starts_at) > now) return false;
  if (link.expires_at && new Date(link.expires_at) < now) return false;

  return true;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const body = await readJson(req);
    const token = String(body.token || "").trim();

    const entered_usdot = digits(body.entered_usdot);
    const entered_plate = upper(body.entered_plate);
    const driver_answered = body.driver_answered === true || body.driver_answered === "yes";

    if (!token) return json(res, 400, { ok: false, error: "Missing token." });
    if (!entered_usdot || !entered_plate) {
      return json(res, 400, { ok: false, error: "Enter USDOT and Plate." });
    }

    const admin = getAdmin();

    const { data: link, error: linkErr } = await admin
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (linkErr) throw linkErr;

    if (!link || !isActive(link)) {
      // Still log attempt (optional). We’ll log it as caution.
      await admin.from("verify_checks").insert([
        {
          token,
          entered_usdot,
          entered_plate,
          driver_answered,
          result: "CAUTION",
        },
      ]);

      return json(res, 200, {
        ok: true,
        verdict: "CAUTION",
        reason: "Link is invalid, not active yet, expired, or revoked.",
      });
    }

    const usdotMatch = digits(link.usdot_on_record) === entered_usdot;
    const plateMatch = upper(link.plate_on_record) === entered_plate;

    const clear = usdotMatch && plateMatch && driver_answered;
    const verdict = clear ? "CLEAR" : "CAUTION";

    const { error: logErr } = await admin.from("verify_checks").insert([
      {
        token,
        entered_usdot,
        entered_plate,
        driver_answered,
        result: verdict,
      },
    ]);

    if (logErr) throw logErr;

    return json(res, 200, {
      ok: true,
      verdict,
      checks: {
        usdot_match: usdotMatch,
        plate_match: plateMatch,
        driver_answered: !!driver_answered,
      },
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || "Server error." });
  }
}
