// /api/admin_beta_approve.js

import { createClient } from "@supabase/supabase-js";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

function makeCode() {
  return `QC-${Math.floor(100000 + Math.random() * 900000)}`;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", () => {
      reject(new Error("Request stream error."));
    });
  });
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

async function generateUniqueCode(supabase) {
  for (let i = 0; i < 20; i++) {
    const code = makeCode();

    const { data, error } = await supabase
      .from("broker_accounts")
      .select("id")
      .eq("access_code", code)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return code;
    }
  }

  throw new Error("Unable to generate unique access code.");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, {
      ok: false,
      error: "Method not allowed.",
    });
  }

  try {
    const adminKey = String(req.headers["x-adbs-admin-key"] || "").trim();
    const expectedKey = String(process.env.ADBS_ADMIN_KEY || "").trim();

    if (!expectedKey || adminKey !== expectedKey) {
      return sendJson(res, 401, {
        ok: false,
        error: "Unauthorized.",
      });
    }

    const body = await readBody(req);
    const id = String(body.id || "").trim();

    if (!id) {
      return sendJson(res, 400, {
        ok: false,
        error: "Missing request id.",
      });
    }

    const supabase = getSupabase();

    const { data: requestRows, error: requestError } = await supabase
      .from("beta_requests")
      .select("*")
      .eq("id", id)
      .limit(1);

    if (requestError) {
      return sendJson(res, 500, {
        ok: false,
        error: "Failed loading beta request.",
        detail: requestError.message,
      });
    }

    const request = requestRows?.[0];

    if (!request) {
      return sendJson(res, 404, {
        ok: false,
        error: "Beta request not found.",
      });
    }

    const businessEmail = normalizeEmail(request.business_email || request.email);

    if (!businessEmail) {
      return sendJson(res, 400, {
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
        request.company_name ||
        ""
    ).trim();

    const contactName = String(request.contact_name || "").trim();
    const businessPhone = String(request.business_phone || request.phone || "").trim();

    const { error: betaUpdateError } = await supabase
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

    if (betaUpdateError) {
      return sendJson(res, 500, {
        ok: false,
        error: "Failed updating beta_requests.",
        detail: betaUpdateError.message,
      });
    }

    const { data: existingRows, error: existingError } = await supabase
      .from("broker_accounts")
      .select("id")
      .eq("business_email", businessEmail)
      .limit(1);

    if (existingError) {
      return sendJson(res, 500, {
        ok: false,
        error: "Failed checking broker_accounts.",
        detail: existingError.message,
      });
    }

    const brokerPayload = {
      business_email: businessEmail,
      access_code: accessCode,
      company_name: companyName,
      role: "broker",
      status: "active",
      contact_name: contactName,
      business_phone: businessPhone,
      updated_at: new Date().toISOString(),
    };

    let brokerWrite;

    if (existingRows && existingRows.length > 0) {
      brokerWrite = await supabase
        .from("broker_accounts")
        .update(brokerPayload)
        .eq("business_email", businessEmail);
    } else {
      brokerWrite = await supabase
        .from("broker_accounts")
        .insert(brokerPayload);
    }

    if (brokerWrite.error) {
      return sendJson(res, 500, {
        ok: false,
        error: "Failed writing broker_accounts.",
        detail: brokerWrite.error.message,
      });
    }

    return sendJson(res, 200, {
      ok: true,
      access_code: accessCode,
      business_email: businessEmail,
    });
  } catch (err) {
    return sendJson(res, 500, {
      ok: false,
      error: "Approval crashed.",
      detail: err?.message || String(err),
    });
  }
}
