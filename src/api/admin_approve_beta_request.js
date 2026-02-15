// /api/admin_approve_beta_request.js
// POST { admin_key, id } -> sets status='approved', writes access_code, approved_at

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { ok: false, error: "Use POST." });

    const body = await readJson(req);
    const adminKey = String(body?.admin_key || "").trim();
    const id = String(body?.id || "").trim();

    if (!adminKey || adminKey !== String(process.env.ADBS_ADMIN_KEY || "")) {
      return json(res, 401, { ok: false, error: "Unauthorized" });
    }
    if (!id) return json(res, 400, { ok: false, error: "Missing id" });

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return json(res, 500, { ok: false, error: "Missing env SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" });
    }

    const access_code = makeCode();
    const approved_at = new Date().toISOString();

    const patchUrl = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

    const r = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "approved",
        access_code,
        approved_at,
        approved: true,
      }),
    });

    const t = await r.text();
    if (!r.ok) return json(res, 500, { ok: false, error: "Supabase update failed", status: r.status, detail: safeJson(t) });

    return json(res, 200, { ok: true, access_code, updated: safeJson(t) });
  } catch (e) {
    return json(res, 500, { ok: false, error: "Server error", detail: String(e?.message || e) });
  }
}

function makeCode() {
  // readable, avoids confusing chars (O/0, I/1)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = "QC-";
  for (let i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

async function readJson(req) {
  try {
    let raw = "";
    for await (const chunk of req) raw += chunk;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}
