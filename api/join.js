export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      legal_name,
      contact_name,
      role,
      mc,
      business_phone,
      business_email,
    } = req.body || {};

    // Light validation (keep it simple; UI already validates too)
    if (
      !legal_name ||
      !contact_name ||
      !role ||
      !mc ||
      !business_phone ||
      !business_email
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error:
          "Server is missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.",
      });
    }

    // Insert into your beta requests table.
    // IMPORTANT: Table name assumed: beta_requests
    const endpoint = `${SUPABASE_URL}/rest/v1/beta_requests`;

    const payload = {
      legal_name: String(legal_name).trim(),
      contact_name: String(contact_name).trim(),
      role: String(role).trim(),
      mc: String(mc).trim().toUpperCase(),
      business_phone: String(business_phone).trim(),
      business_email: String(business_email).trim(),
      status: "PENDING",
      created_at: new Date().toISOString(),
    };

    const supaRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!supaRes.ok) {
      const txt = await supaRes.text();
      return res.status(500).json({
        error: "Supabase insert failed",
        details: txt,
      });
    }

    const data = await supaRes.json();
    return res.status(200).json({ ok: true, record: data?.[0] || null });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
