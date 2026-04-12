import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function safe(v) {
  return String(v ?? "").trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const email = safe(body.email);

    if (!email) {
      return json(res, 400, { ok: false, error: "Missing email" });
    }

    const { data, error } = await supabase
      .from("beta_requests")
      .select("id")
      .eq("business_email", email.toLowerCase())
      .maybeSingle();

    if (error) {
      return json(res, 500, { ok: false, error: error.message || "Could not find beta request." });
    }

    if (!data?.id) {
      return json(res, 404, { ok: false, error: "No beta request found for that email." });
    }

    req.body = { id: data.id, admin_key: body.admin_key };
    const { default: realHandler } = await import("./admin_beta_approve.js");
    return realHandler(req, res);
  } catch (err) {
    return json(res, 500, { ok: false, error: err?.message || "Server error" });
  }
}
