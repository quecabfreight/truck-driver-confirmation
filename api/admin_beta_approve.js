// /api/admin_beta_approve.js
// POST /api/admin_beta_approve
// Requires header: x-adbs-admin-key
// Body: { id: "beta_request_id" }

import { supabaseAdmin } from "./_supabaseAdmin.js";

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function getAdminKey(req) {
  return String(req.headers?.["x-adbs-admin-key"] || "").trim();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanPhone(value) {
  return String(value || "").trim();
}

function makeAccessCode() {
  return `QC-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function generateUniqueAccessCode() {
  for (let i = 0; i < 10; i++) {
    const code = makeAccessCode();

    const { data, error } = await supabaseAdmin
      .from("broker_accounts")
      .select("id")
      .eq("access_code", code)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return code;
    }
  }

  throw new Error("Could not generate a unique access code.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed." });
  }

  try {
    const expectedKey = String(process.env.ADBS_ADMIN_KEY || "").trim();
    const providedKey = getAdminKey(req);

    if (!expectedKey || providedKey !== expectedKey) {
      return json(res, 401, { ok: false, error: "Unauthorized." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const id = String(body.id || "").trim();

    if (!id) {
      return json(res, 400, { ok: false, error: "Missing beta request id." });
    }

    const { data: request, error: requestError } = await supabaseAdmin
      .from("beta_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (requestError) {
      return json(res, 500, {
        ok: false,
        error: "Could not load beta request.",
        detail: requestError.message,
      });
    }

    if (!request) {
      return json(res, 404, { ok: false, error: "Beta request not found." });
    }

    const businessEmail = normalizeEmail(request.business_email || request.email);

    if (!businessEmail) {
      return json(res, 400, {
        ok: false,
        error: "This request has no business email.",
      });
    }

    const companyName = String(
      request.legal_business_name ||
        request.business_name ||
        request.company_name ||
        ""
    ).trim();

    const contactName = String(request.contact_name || "").trim();
    const businessPhone = cleanPhone(request.business_phone || request.phone);
    const accessCode = request.access_code || (await generateUniqueAccessCode());

    const betaUpdate = {
      status: "approved",
      approved: true,
      role: "broker",
      email: businessEmail,
      business_email: businessEmail,
      access_code: accessCode,
    };

    const { error: betaUpdateError } = await supabaseAdmin
      .from("beta_requests")
      .update(betaUpdate)
      .eq("id", id);

    if (betaUpdateError) {
      return json(res, 500, {
        ok: false,
        error: "Could not approve beta request.",
        detail: betaUpdateError.message,
      });
    }

    const brokerAccount = {
      business_email: businessEmail,
      access_code: accessCode,
      company_name: companyName,
      role: "broker",
      status: "active",
      contact_name: contactName,
      business_phone: businessPhone,
      updated_at: new Date().toISOString(),
    };

    const { error: brokerError } = await supabaseAdmin
      .from("broker_accounts")
      .upsert(brokerAccount, { onConflict: "business_email" });

    if (brokerError) {
      return json(res, 500, {
        ok: false,
        error: "Beta request was approved, but broker account could not be created.",
        detail: brokerError.message,
      });
    }

    return json(res, 200, {
      ok: true,
      access_code: accessCode,
      business_email: businessEmail,
      company_name: companyName,
      status: "approved",
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Approval failed.",
      detail: err?.message || String(err),
    });
  }
}
