import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function safeStr(v) {
  return String(v ?? "").trim();
}

function normalizeEmail(v) {
  return safeStr(v).toLowerCase();
}

function randomQcCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `QC-${n}`;
}

function isAdminAuthorized(req) {
  const supplied = safeStr(req.headers["x-adbs-admin-key"]);
  const expected = safeStr(process.env.ADBS_ADMIN_KEY);
  return !!supplied && !!expected && supplied === expected;
}

async function generateUniqueAccessCode() {
  for (let i = 0; i < 20; i += 1) {
    const code = randomQcCode();

    const { data, error } = await supabase
      .from("broker_accounts")
      .select("id")
      .eq("access_code", code)
      .maybeSingle();

    if (error) {
      throw new Error(error.message || "Could not verify generated access code.");
    }

    if (!data) return code;
  }

  throw new Error("Could not generate a unique access code.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  if (!isAdminAuthorized(req)) {
    return json(res, 401, { ok: false, error: "Unauthorized admin request." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const email = normalizeEmail(body.email);

    if (!email) {
      return json(res, 400, { ok: false, error: "Missing email." });
    }

    const { data: existing, error: lookupError } = await supabase
      .from("broker_accounts")
      .select("*")
      .eq("business_email", email)
      .maybeSingle();

    if (lookupError) {
      return json(res, 500, { ok: false, error: lookupError.message || "Could not load broker account." });
    }

    if (!existing) {
      return json(res, 404, { ok: false, error: "Broker account not found." });
    }

    const accessCode = await generateUniqueAccessCode();

    const { error: updateBrokerError } = await supabase
      .from("broker_accounts")
      .update({
        access_code: accessCode,
        updated_at: new Date().toISOString()
      })
      .eq("business_email", email);

    if (updateBrokerError) {
      return json(res, 500, { ok: false, error: updateBrokerError.message || "Could not reset broker access code." });
    }

    const { error: updateBetaError } = await supabase
      .from("beta_requests")
      .update({
        access_code: accessCode
      })
      .eq("business_email", email);

    if (updateBetaError) {
      return json(res, 500, { ok: false, error: updateBetaError.message || "Could not sync beta request access code." });
    }

    return json(res, 200, {
      ok: true,
      email,
      access_code: accessCode
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
