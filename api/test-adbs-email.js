import { sendAdbsEmail } from "./_sendAdbsEmail.js";

export default async function handler(req, res) {
  try {
    const to = String(req.query?.to || "quecabadbs@gmail.com").trim();

    const result = await sendAdbsEmail({
      to,
      subject: "QueCab AdbS Shared Email Helper Test",
      html: `
        <div style="font-family:Arial,sans-serif;background:#0b111b;color:#fff;padding:24px;">
          <h1>AdbS Shared Email Helper Test</h1>
          <p>If you received this, the shared AdbS email helper is working.</p>
        </div>
      `,
      text: "If you received this, the shared AdbS email helper is working."
    });

    return res.status(200).json({
      ok: true,
      sent_to: to,
      result
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || String(err)
    });
  }
}
