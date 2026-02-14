// api/issue_verify_link.js
import crypto from "crypto";
import { getAdmin, json, readJson } from "./_supabaseAdmin.js";

function normUpper(s) {
  return String(s || "").trim().toUpperCase();
}
function normDigits(s) {
  return String(s || "").replace(/\D/g, "").trim();
}
function safeIsoOrNull(s) {
  const v = String(s || "").trim();
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function buildVerifyUrl(req, token) {
  // Works for your HashRouter route: /#/verify/:token
  const proto = (req.headers["x-forwarded-proto"] || "https").toString();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString();
  return `${proto}://${host}/#/verify/${token}`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const body = await readJson(req);

    const usdot = normDigits(body.usdot_on_record);
    const plate = normUpper(body.plate_on_record);
    const phone = normDigits(body.driver_phone).slice(0, 15); // allow country code if you ever do

    const startsAt = safeIsoOrNull(body.starts_at) || new Date().toISOString();
    const expiresAt = safeIsoOrNull(body.expires_at);

    if (!usdot || !plate || !phone) {
      return json(res, 400, {
        ok: false,
        error: "Missing required fields: USDOT, Plate, Driver Phone.",
      });
    }

    if (expiresAt && new Date(expiresAt) <= new Date(startsAt)) {
      return json(res, 400, {
        ok: false,
        error: "Expires must be after Starts.",
      });
    }

    const token = crypto.randomBytes(18).toString("base64url"); // short + URL-safe

    const admin = getAdmin();

    const { error } = await admin.from("verify_links").insert([
      {
        token,
        usdot_on_record: usdot,
        plate_on_record: plate,
        driver_phone: phone,
        status: "active",
        starts_at: startsAt,
        expires_at: expiresAt,
      },
    ]);

    if (error) throw error;

    const verify_url = buildVerifyUrl(req, token);

    return json(res, 200, {
      ok: true,
      token,
      verify_url,
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: e?.message || "Server error." });
  }
}
