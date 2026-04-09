import { Resend } from "resend";

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  try {
    const apiKey = String(process.env.RESEND_API_KEY || "").trim();
    const from = String(process.env.ADBS_EMAIL_FROM || "").trim();
    const to = String(process.env.ADBS_ALERT_EMAIL || "").trim();

    if (!apiKey) {
      return json(res, 500, {
        ok: false,
        step: "env",
        error: "Missing RESEND_API_KEY in Vercel."
      });
    }

    if (!from) {
      return json(res, 500, {
        ok: false,
        step: "env",
        error: "Missing ADBS_EMAIL_FROM in Vercel."
      });
    }

    if (!to) {
      return json(res, 500, {
        ok: false,
        step: "env",
        error: "Missing ADBS_ALERT_EMAIL in Vercel."
      });
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to,
      subject: "AdbS Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #0b0f14; color: #ffffff;">
          <h2>AdbS Test Email</h2>
          <p>If you received this, the QueCab AdbS email system is connected correctly.</p>
        </div>
      `
    });

    return json(res, 200, {
      ok: true,
      result
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      step: "send",
      error: err?.message || "Unknown send failure"
    });
  }
}
