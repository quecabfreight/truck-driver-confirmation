import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  try {
    const data = await resend.emails.send({
      from: process.env.ADBS_EMAIL_FROM,
      to: "YOUR_EMAIL_HERE",
      subject: "AdbS Test Email",
      html: "<strong>If you got this, you're LIVE.</strong>"
    });

    res.status(200).json({ ok: true, data });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
