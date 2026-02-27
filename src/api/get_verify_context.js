// /src/api/get_verify_context.js
import { createClient } from "@supabase/supabase-js";

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  try {
    const t = String((req.query && (req.query.t || req.query.token)) || "").trim();
    if (!t) return json(res, 400, { ok: false, error: "Missing token (t)." });

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return json(res, 500, { ok: false, error: "Server not configured (Supabase env missing)." });
    }

    const sb = createClient(url, key, { auth: { persistSession: false } });

    const { data, error } = await sb
      .from("verify_links")
      .select("token, load_id, status, starts_at, expires_at")
      .eq("token", t)
      .maybeSingle();

    if (error) return json(res, 500, { ok: false, error: error.message });
    if (!data) return json(res, 404, { ok: false, error: "Link not found." });

    // IMPORTANT: do NOT reveal driver_phone here.
    return json(res, 200, { ok: true, context: data });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Unexpected server error." });
  }
}
