import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data: links, error: linksError } = await supabase
      .from("verify_links")
      .select("status");

    if (linksError) {
      return res.status(500).json({ error: linksError.message || "Failed to load verify_links" });
    }

    const { data: checks, error: checksError } = await supabase
      .from("verify_checks")
      .select("result");

    if (checksError) {
      return res.status(500).json({ error: checksError.message || "Failed to load verify_checks" });
    }

    const verifications = Array.isArray(links) ? links.length : 0;
    const cleared = Array.isArray(links)
      ? links.filter((x) => String(x.status || "").toLowerCase() === "cleared").length
      : 0;

    const caution = Array.isArray(checks)
      ? checks.filter((x) => String(x.result || "").toLowerCase().includes("caution")).length
      : 0;

    return res.status(200).json({
      verifications,
      cleared,
      caution
    });
  } catch (e) {
    return res.status(500).json({
      error: e?.message || "Server error"
    });
  }
}
