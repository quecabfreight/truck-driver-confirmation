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

function digitsOnly(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhoneHyphen(v) {
  const d = digitsOnly(v).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
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
    const id = safeStr(body.id);

    if (!id) {
      return json(res, 400, { ok: false, error: "Missing beta request id." });
    }

    const { data: requestRow, error: requestError } = await supabase
      .from("beta_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (requestError) {
      return json(res, 500, { ok: false, error: requestError.message || "Could not load beta request." });
    }

    if (!requestRow) {
      return json(res, 404, { ok: false, error: "Beta request not found." });
    }

    const businessEmail = normalizeEmail(
      requestRow.business_email || requestRow.email || requestRow.contact_email
    );

    if (!businessEmail) {
      return json(res, 400, { ok: false, error: "Approved request is missing business email." });
    }

    const companyName = safeStr(
      requestRow.legal_business_name ||
      requestRow.legal_name ||
      requestRow.business_name ||
      requestRow.company_name
    );

    const contactName = safeStr(requestRow.contact_name);
    const businessPhone = formatPhoneHyphen(requestRow.business_phone || requestRow.phone || "");
    const accessCode = await generateUniqueAccessCode();

    const { error: betaUpdateError } = await supabase
      .from("beta_requests")
      .update({
        status: "approved",
        role: "broker",
        email: businessEmail,
        access_code: accessCode
      })
      .eq("id", id);

    if (betaUpdateError) {
      return json(res, 500, { ok: false, error: betaUpdateError.message || "Could not approve beta request." });
    }

    const brokerRow = {
      company_name: companyName || null,
      business_email: businessEmail,
      access_code: accessCode,
      role: "broker",
      status: "active",
      contact_name: contactName || null,
      business_phone: businessPhone || null,
      updated_at: new Date().toISOString()
    };

    const { error: upsertError } = await supabase
      .from("broker_accounts")
      .upsert(brokerRow, { onConflict: "business_email" });

    if (upsertError) {
      return json(res, 500, { ok: false, error: upsertError.message || "Could not sync broker account." });
    }

    return json(res, 200, {
      ok: true,
      id,
      email: businessEmail,
      access_code: accessCode
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
