// /api/approve_user.js

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + 30);

    const { data, error } = await supabase
      .from("beta_requests")
      .update({
        approved: true,
        trial_start: now.toISOString(),
        trial_end: trialEnd.toISOString(),
        trial_active: true
      })
      .eq("email", email);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
