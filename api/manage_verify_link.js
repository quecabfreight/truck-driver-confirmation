function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

async function safeJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function sbHeaders() {
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
}

async function sbFetchOneByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders()
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to load verification");
  }

  return Array.isArray(data) ? data[0] || null : null;
}

async function sbFetchAttemptsByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_checks` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&order=checked_at.desc`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders()
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to load attempts");
  }

  return Array.isArray(data) ? data : [];
}

async function sbPatchLinkByToken(token, patch) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?token=eq.${encodeURIComponent(token)}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify(patch)
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to update verification");
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const action = String(body.action || "").trim().toLowerCase();
    const token = String(body.token || "").trim();

    if (!action) return json(res, 400, { ok: false, error: "Missing action" });

    if (action === "lookup") {
      if (!token) return json(res, 400, { ok: false, error: "Missing Verification ID" });

      const link = await sbFetchOneByToken(token);
      if (!link) return json(res, 404, { ok: false, error: "Verification not found" });

      const attempts = await sbFetchAttemptsByToken(token);

      const origin =
        (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
        (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

      return json(res, 200, {
        ok: true,
        token: link.token,
        load_id: link.load_id || null,
        status: link.status || "active",
        verify_url: `${origin}/v.html?t=${link.token}`,
        expires_at: link.expires_at || null,
        carrier_company: link.carrier_company || "",
        carrier_contact_name: link.dispatch_contact || "",
        carrier_contact_phone: link.dispatch_phone || "",
        attempts
      });
    }

    if (action === "lock") {
      if (!token) return json(res, 400, { ok: false, error: "Missing Verification ID" });
      await sbPatchLinkByToken(token, { status: "locked" });
      return json(res, 200, { ok: true, status: "locked" });
    }

    if (action === "clear") {
      if (!token) return json(res, 400, { ok: false, error: "Missing Verification ID" });
      await sbPatchLinkByToken(token, {
        status: "cleared",
        cleared_at: new Date().toISOString()
      });
      return json(res, 200, { ok: true, status: "cleared" });
    }

    return json(res, 400, { ok: false, error: "Unknown action" });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
