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

function safe(v) {
  return String(v ?? "").trim();
}

function makeCode() {
  return `QC-${Math.floor(100000 + Math.random() * 900000)}`;
}

function escapeHtml(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

async function sendApprovalEmail({
  to,
  contactName,
  companyName,
  accessCode,
}) {
  try {
    const apiKey = safe(process.env.RESEND_API_KEY);
    const from =
      safe(process.env.ADBS_EMAIL_FROM) ||
      "QueCab AdbS <verify@quecabadbs.com>";

    if (!apiKey) {
      return {
        ok: false,
        error: "Missing RESEND_API_KEY.",
      };
    }

    if (!to) {
      return {
        ok: false,
        error: "Missing approval email recipient.",
      };
    }

    const loginUrl = "https://quecabadbs.com/login";

    const html = `
      <div style="margin:0;padding:0;background:#0b111b;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:660px;margin:0 auto;padding:26px 18px;">
          <div style="background:#101a28;border:1px solid rgba(255,255,255,0.14);border-radius:18px;padding:26px;box-shadow:0 16px 38px rgba(0,0,0,0.35);">
            <div style="font-size:26px;font-weight:900;letter-spacing:0.2px;margin-bottom:4px;">
              QueCab AdbS
            </div>

            <div style="color:#9fb2cc;font-size:14px;margin-bottom:24px;">
              Anti-Double-Broker System
            </div>

            <div style="font-size:24px;font-weight:900;margin-bottom:14px;">
              Broker Access Approved
            </div>

            <p style="font-size:15px;line-height:1.65;color:#e7eef8;margin:0 0 14px;">
              Hello ${escapeHtml(contactName || "there")},
            </p>

            <p style="font-size:15px;line-height:1.65;color:#e7eef8;margin:0 0 18px;">
              Your QueCab AdbS broker access has been approved${
                companyName
                  ? ` for <b>${escapeHtml(companyName)}</b>`
                  : ""
              }.
            </p>

            <div style="background:#07101c;border:1px solid rgba(120,180,255,0.38);border-radius:14px;padding:18px;margin:22px 0;">
              <div style="color:#9fb2cc;font-size:13px;font-weight:700;margin-bottom:6px;">
                Business Email
              </div>
              <div style="font-size:17px;font-weight:900;color:#ffffff;word-break:break-all;">
                ${escapeHtml(to)}
              </div>

              <div style="height:14px;"></div>

              <div style="color:#9fb2cc;font-size:13px;font-weight:700;margin-bottom:6px;">
                Access Code
              </div>
              <div style="font-size:30px;font-weight:900;letter-spacing:1px;color:#8fc7ff;">
                ${escapeHtml(accessCode)}
              </div>
            </div>

                        <p style="font-size:15px;line-height:1.75;color:#e7eef8;margin:0 0 20px;">
              Your broker account has been approved.
              <br /><br />
              <strong>Next Step:</strong>
              <br /><br />
              Log in using your approved business email and access code.
              <br /><br />
              If a subscription has not yet been activated, you will be guided to choose a QueCab AdbS plan before entering the Control Center.
            </p>            </p>

            <div style="text-align:center;margin:28px 0;">
              <a href="${loginUrl}" style="display:inline-block;background:#245fba;color:#ffffff;text-decoration:none;font-weight:900;padding:14px 24px;border-radius:12px;border:1px solid rgba(120,180,255,0.55);">
                Activate & Access QueCab AdbS
              </a>
            </div>

            <div style="background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.10);border-radius:14px;padding:15px;margin-top:18px;">
              <div style="font-size:15px;font-weight:900;margin-bottom:6px;">
                Founding Beta Access
              </div>
              <div style="font-size:14px;line-height:1.6;color:#c9d6e6;">
                Founding beta access is active during the beta period.
                Future pricing begins at $149/month.
              </div>
            </div>

            <div style="border-top:1px solid rgba(255,255,255,0.12);margin-top:24px;padding-top:16px;color:#9fb2cc;font-size:13px;line-height:1.6;">
              QueCab AdbS™ — Verification happens before freight moves.<br/>
              © 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
            </div>
          </div>
        </div>
      </div>
    `;

    const text = `
QueCab AdbS — Access Approved

Hello ${contactName || "there"},

Your QueCab AdbS broker access has been approved${
      companyName ? ` for ${companyName}` : ""
    }.

Business Email: ${to}
Access Code: ${accessCode}

Next Step:

Log in using your approved business email and access code:

${loginUrl}

If a subscription has not yet been activated, you will be guided to select a QueCab AdbS plan before entering the Control Center.

Founding beta access is active during the beta period.
Future pricing begins at $149/month.

QueCab AdbS — Verification happens before freight moves.
© 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
    `.trim();

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "QueCab AdbS — Access Approved",
        html,
        text,
      }),
    });

    const rText = await r.text();

    let rData;
    try {
      rData = JSON.parse(rText);
    } catch {
      rData = rText;
    }

    if (!r.ok) {
      return {
        ok: false,
        error:
          typeof rData === "string"
            ? rData
            : rData?.message || "Approval email failed.",
      };
    }

    return {
      ok: true,
      data: rData,
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || String(err),
    };
  }
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
      brokerWrite = await supabase.from("broker_accounts").insert(brokerPayload);
    }

    if (brokerWrite.error) {
      return sendJson(res, 500, {
        ok: false,
        error: "Failed writing broker_accounts.",
        detail: brokerWrite.error.message,
      });
    }

    const emailResult = await sendApprovalEmail({
      to: businessEmail,
      contactName,
      companyName,
      accessCode,
    });

    return sendJson(res, 200, {
      ok: true,
      access_code: accessCode,
      business_email: businessEmail,
      email_status: emailResult.ok ? "sent" : "not_sent",
      email_error: emailResult.ok ? null : emailResult.error,
    });
  } catch (err) {
    return sendJson(res, 500, {
      ok: false,
      error: "Approval crashed.",
      detail: err?.message || String(err),
    });
  }
}
