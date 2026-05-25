// /api/_sendAdbsEmail.js

function safe(v) {
  return String(v ?? "").trim();
}

export function escapeHtml(v) {
  return String(v || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendAdbsEmail({ to, subject, html, text }) {
  try {
    const apiKey = safe(process.env.RESEND_API_KEY);
    const from =
      safe(process.env.ADBS_EMAIL_FROM) ||
      "QueCab AdbS <verify@quecabadbs.com>";

    if (!apiKey) {
      return { ok: false, error: "Missing RESEND_API_KEY." };
    }

    if (!to) {
      return { ok: false, error: "Missing email recipient." };
    }

    if (!subject) {
      return { ok: false, error: "Missing email subject." };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        text: text || ""
      })
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    if (!response.ok) {
      return {
        ok: false,
        error:
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Email send failed.",
        data
      };
    }

    return {
      ok: true,
      data
    };
  } catch (err) {
    return {
      ok: false,
      error: err?.message || String(err)
    };
  }
}
