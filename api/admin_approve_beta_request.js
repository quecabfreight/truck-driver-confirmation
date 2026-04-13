import { Resend } from "resend";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "Use POST." });
    }

    // Safe body parsing
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

    // 👉 STEP 1: GET REQUEST DATA (we need email + name)
    const getUrl = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}&select=*`;

    const getRes = await fetch(getUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const getData = await getRes.json();
    const row = Array.isArray(getData) ? getData[0] : null;

    if (!row) {
      return json(res, 404, { ok: false, error: "Request not found." });
    }

    const email =
      row.business_email ||
      row.email ||
      "";

    const name =
      row.contact_name ||
      row.legal_business_name ||
      "there";

    if (!email) {
      return json(res, 400, { ok: false, error: "No email found on request." });
    }

    // 👉 STEP 2: GENERATE ACCESS CODE
    const access_code = makeCode();

    // 👉 STEP 3: UPDATE DATABASE
    const updateUrl = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

    const updateRes = await fetch(updateUrl, {
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
        access_code,
      }),
    });

    const updateText = await updateRes.text();
    let updateData;
    try {
      updateData = JSON.parse(updateText);
    } catch {
      updateData = updateText;
    }

    if (!updateRes.ok) {
      return json(res, 500, { ok: false, error: "Supabase update failed.", details: updateData });
    }

    // 👉 STEP 4: SEND APPROVAL EMAIL
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.ADBS_EMAIL_FROM,
        to: email,
        subject: "QueCab AdbS — Access Approved",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>QueCab AdbS</h2>

            <p>Hello ${name},</p>

            <p>Your access to <strong>QueCab AdbS</strong> has been approved.</p>

            <p><strong>Access Code:</strong><br/>
            <span style="font-size: 20px; letter-spacing: 2px;">${access_code}</span></p>

            <p>
              👉 <a href="https://quecabadbs.com/#/login" target="_blank">
              Log in to your account
              </a>
            </p>

            <p>What to do next:</p>
            <ul>
              <li>Log in using your business email + access code</li>
              <li>Issue your first Truck-Driver verification</li>
            </ul>

            <p style="margin-top: 20px;">
              If it’s working for you, we’ll move you into a plan that fits your volume.
            </p>

            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              QueCab AdbS — Verification happens before freight moves.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
      // DO NOT fail approval if email fails
    }

    return json(res, 200, { ok: true, access_code, updated: updateData });

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

function json(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
