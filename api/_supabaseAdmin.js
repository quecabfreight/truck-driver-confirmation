// /api/admin_beta_approve.js

import { getAdmin, json, readJson } from "./_supabaseAdmin.js";

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function makeCode() {
  return `QC-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function generateUniqueCode(supabase) {
  for (let i = 0; i < 20; i++) {
    const code = makeCode();

    const { data, error } = await supabase
      .from("broker_accounts")
      .select("id")
      .eq("access_code", code)
      .limit(1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return code;
    }
  }

  throw new Error("Unable to generate unique access code.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed.",
    });
  }

  try {
    const adminKey = String(req.headers["x-adbs-admin-key"] || "").trim();
    const expectedKey = String(process.env.ADBS_ADMIN_KEY || "").trim();

    if (!adminKey || adminKey !== expectedKey) {
      return json(res, 401, {
        ok: false,
        error: "Unauthorized.",
      });
    }

    const supabase = getAdmin();
    const body = await readJson(req);

    const id = String(body.id || "").trim();

    if (!id) {
      return json(res, 400, {
        ok: false,
        error: "Missing request id.",
      });
    }

    const requestResult = await supabase
      .from("beta_requests")
      .select("*")
      .eq("id", id)
      .limit(1);

    if (requestResult.error) {
      return json(res, 500, {
        ok: false,
        error: "Failed loading beta request.",
        detail: requestResult.error.message,
      });
    }

    const request = requestResult.data?.[0];

    if (!request) {
      return json(res, 404, {
        ok: false,
        error: "Beta request not found.",
      });
    }

    const businessEmail = normalizeEmail(
      request.business_email ||
        request.email
    );

    if (!businessEmail) {
      return json(res, 400, {
        ok: false,
        error: "No business email found on request.",
      });
    }

    const accessCode =
      String(request.access_code || "").trim() ||
      (await generateUniqueCode(supabase));

    const companyName = String(
      request.legal_business_name ||
        request.business_name ||
        ""
    ).trim();

    const contactName = String(request.contact_name || "").trim();
    const businessPhone = String(request.business_phone || "").trim();

    const betaUpdate = await supabase
      .from("beta_requests")
      .update({
        approved: true,
        status: "approved",
        role: "broker",
        email: businessEmail,
        business_email: businessEmail,
        access_code: accessCode,
      })
      .eq("id", id);

    if (betaUpdate.error) {
      return json(res, 500, {
        ok: false,
        error: "Failed updating beta_requests.",
        detail: betaUpdate.error.message,
      });
    }

    const existingBroker = await supabase
      .from("broker_accounts")
      .select("id")
      .eq("business_email", businessEmail)
      .limit(1);

    if (existingBroker.error) {
      return json(res, 500, {
        ok: false,
        error: "Failed checking broker_accounts.",
        detail: existingBroker.error.message,
      });
    }

    const exists =
      Array.isArray(existingBroker.data) &&
      existingBroker.data.length > 0;

    let brokerResult;

    if (exists) {
      brokerResult = await supabase
        .from("broker_accounts")
        .update({
          access_code: accessCode,
          company_name: companyName,
          role: "broker",
          status: "active",
          contact_name: contactName,
          business_phone: businessPhone,
          updated_at: new Date().toISOString(),
        })
        .eq("business_email", businessEmail);
    } else {
      brokerResult = await supabase
        .from("broker_accounts")
        .insert({
          business_email: businessEmail,
          access_code: accessCode,
          company_name: companyName,
          role: "broker",
          status: "active",
          contact_name: contactName,
          business_phone: businessPhone,
          updated_at: new Date().toISOString(),
        });
    }

    if (brokerResult.error) {
      return json(res, 500, {
        ok: false,
        error: "Failed writing broker_accounts.",
        detail: brokerResult.error.message,
      });
    }

    return json(res, 200, {
      ok: true,
      access_code: accessCode,
      business_email: businessEmail,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Approval crashed.",
      detail: err?.message || String(err),
    });
  }
}
