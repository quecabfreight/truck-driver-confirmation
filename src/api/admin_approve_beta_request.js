export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "Use POST." });
    }

    let body = {};
    try {
      if (typeof req.body === "object") body = req.body;
      else body = JSON.parse(req.body || "{}");
    } catch {
      body = {};
    }

    const admin_key = String(body.admin_key || "").trim();
    const id = String(body.id || "").trim();

    const ADBS_ADMIN_KEY = (process.env.ADBS_ADMIN_KEY || "").trim();
    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!ADBS_ADMIN_KEY) return json(res, 500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SUPABASE_SERVICE_ROLE_KEY) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    if (admin_key !== ADBS_ADMIN_KEY) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    if (!id) {
      return json(res, 400, { ok: false, error: "Missing id." });
    }

    const getUrl =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=id,business_email,email,contact_name,legal_business_name,status,approved,access_code` +
      `&id=eq.${encodeURIComponent(id)}` +
      `&limit=1`;

    const g = await fetch(getUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const gText = await g.text();
    let gData;
    try {
      gData = JSON.parse(gText);
    } catch {
      gData = gText;
    }

    if (!g.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (fetch row).", details: gData });
    }

    const row = Array.isArray(gData) ? gData[0] : null;
    if (!row) {
      return json(res, 404, { ok: false, error: "Request not found." });
    }

    const businessEmail = String(row.business_email || row.email || "").trim().toLowerCase();
    const contactName = String(row.contact_name || "").trim();
    const companyName = String(row.legal_business_name || "").trim();

    const existingCode = String(row.access_code || "").trim();
    const alreadyApproved =
      row.approved === true || String(row.status || "").toLowerCase().trim() === "approved";

    if (alreadyApproved) {
      const emailResult = await sendApprovalEmail({
        to: businessEmail,
        contactName,
        companyName,
        accessCode: existingCode,
      });

      return json(res, 200, {
        ok: true,
        note: "Already approved (no changes made).",
        access_code: existingCode || null,
        id: row.id,
        business_email: businessEmail || null,
        email_status: emailResult.ok ? "sent" : "not_sent",
        email_error: emailResult.ok ? null : emailResult.error,
      });
    }

    const finalCode = existingCode || makeCode();

    const patchUrl = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

    const p = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        approved: true,
        status: "approved",
        access_code: finalCode,
      }),
    });

    const pText = await p.text();
    let pData;
    try {
      pData = JSON.parse(pText);
    } catch {
      pData = pText;
    }

    if (!p.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (approve).", details: pData });
    }

    const emailResult = await sendApprovalEmail({
      to: businessEmail,
      contactName,
      companyName,
      accessCode: finalCode,
    });

    return json(res, 200, {
      ok: true,
      access_code: finalCode,
      updated: pData,
      email_status: emailResult.ok ? "sent" : "not_sent",
      email_error: emailResult.ok ? null : emailResult.error,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Server error (approve).",
      details: String(err?.message || err),
    });
  }
}

function makeCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `QC-${n}`;
}

async function sendApprovalEmail({ to, contactName, companyName, accessCode }) {
  try {
    const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
    const from = String(process.env.ADBS_EMAIL_FROM || "QueCab AdbS <verify@quecabadbs.com>").trim();

    if (!RESEND_API_KEY) {
      return { ok: false, error: "Missing RESEND_API_KEY" };
    }

    if (!to) {
      return { ok: false, error: "Missing approval email recipient." };
    }

    const loginUrl = "https://quecabadbs.com/login";

    const html = `
      <div style="font-family:Arial,sans-serif;background:#0b111b;color:#ffffff;padding:24px;">
        <div style="max-width:640px;margin:0 auto;background:#101a28;border:1px solid rgba(255,255,255,0.14);border-radius:18px;padding:24px;">
          <h1 style="margin:0 0 10px;font-size:26px;">QueCab AdbS</h1>
          <div style="color:#9fb2cc;margin-bottom:22px;">Anti-Double-Broker System</div>

          <h2 style="margin:0 0 14px;font-size:22px;">Access Approved</h2>

          <p style="line-height:1.6;">
            Hello ${escapeHtml(contactName || "there")},
          </p>

          <p style="line-height:1.6;">
            Your QueCab AdbS broker access has been approved${companyName ? ` for <b>${escapeHtml(companyName)}</b>` : ""}.
          </p>

          <div style="background:#07101c;border:1px solid rgba(120,180,255,0.35);border-radius:14px;padding:18px;margin:22px 0;">
            <div style="color:#9fb2cc;font-size:13px;margin-bottom:6px;">Your Access Code</div>
            <div style="font-size:28px;font-weight:900;letter-spacing:1px;color:#8fc7ff;">${escapeHtml(accessCode)}</div>
          </div>

          <p style="line-height:1.6;">
            Use your approved business email and access code to log in.
          </p>

          <p style="text-align:center;margin:28px 0;">
            <a href="${loginUrl}" style="display:inline-block;background:#245fba;color:#ffffff;text-decoration:none;font-weight:900;padding:14px 22px;border-radius:12px;border:1px solid rgba(120,180,255,0.55);">
              Log In to QueCab AdbS
            </a>
          </p>

          <p style="line-height:1.6;color:#c9d6e6;">
            Founding beta access is active during the beta period. Future pricing begins at $149/month.
          </p>

          <div style="border-top:1px solid rgba(255,255,255,0.12);margin-top:24px;padding-top:16px;color:#9fb2cc;font-size:13px;line-height:1.6;">
            QueCab AdbS™ — Verification happens before freight moves.<br/>
            © 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
          </div>
        </div>
      </div>
    `;

    const text = `
QueCab AdbS — Access Approved

Hello ${contactName || "there"},

Your QueCab AdbS broker access has been approved${companyName ? ` for ${companyName}` : ""}.

Business Email: ${to}
Access Code: ${accessCode}

Log in:
${loginUrl}

Founding beta access is active during the beta period.
Future pricing begins at $149/month.

QueCab AdbS — Verification happens before freight moves.
© 2026 Omnimobile Inc. All Rights Reserved. Patent Pending.
    `.trim();

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
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
        error: typeof rData === "string" ? rData : rData?.message || "Approval email failed.",
      };
    }

    return { ok: true, data: rData };
  } catch (err) {
    return { ok: false, error: String(err?.message || err) };
  }
}

function escapeHtml(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function json(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
