import { sendAdbsEmail } from "./_sendAdbsEmail.js";

export default async function handler(req, res) {
  try {
    const result = await sendAdbsEmail({
      to: "quecabadbstest@gmail.com",
      subject: "QueCab AdbS Shared Email Helper Test",
      html: `
        <div style="font-family:Arial,sans-serif;background:#0b111b;color:#fff;padding:24px;">
          <h1>AdbS Shared Email Helper Test</h1>

          <p>
            If you received this email, the shared helper system is working.
          </p>

          <p>
            This means Request Access and Approval emails should also be able to work.
          </p>
        </div>
      `,
      text:
        "If you received this email, the shared helper system is working."
    });

    return res.status(200).json({
      ok: true,
      result
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err?.message || String(err)
    });
  }
}
