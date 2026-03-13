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

function formatPhoneHyphen(s) {
  const d = String(s || "").replace(/\D/g, "").slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function extractToken(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";

  try {
    if (raw.includes("/v.html?t=") || raw.includes("t=")) {
      const url = new URL(raw);
      return String(url.searchParams.get("t") || "").trim();
    }
  } catch {}

  const tMatch = raw.match(/[?&]t=([^&]+)/i);
  if (tMatch?.[1]) {
    return decodeURIComponent(tMatch[1]).trim();
  }

  return raw;
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
    throw new Error(data?.message || data?.error || "Failed to load verification by token");
  }

  return Array.isArray(data) ? data[0] || null : null;
}

async function sbFetchOneByLoadId(loadId) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?load_id=eq.${encodeURIComponent(loadId)}` +
    `&select=*` +
    `&order=created_at.desc` +
    `&limit=1`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders()
  });

  const data = await safeJsonResponse(res);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Failed to load verification by load id");
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
    const rawToken = String(body.token || "").trim();

    if (!action) {
      return json(res, 400, { ok: false, error: "Missing action" });
    }

    if (action === "lookup") {
      if (!rawToken) {
        return json(res, 400, { ok: false, error: "Missing Verification ID or SmartLink" });
      }

      const extracted = extractToken(rawToken);

      let link = await sbFetchOneByToken(extracted);

      if (!link) {
        link = await sbFetchOneByLoadId(rawToken);
      }

      if (!link) {
        return json(res, 404, {
          ok: false,
          error: "Verification not found",
          searched: rawToken,
          parsed_token: extracted
        });
      }

      const attempts = await sbFetchAttemptsByToken(link.token);

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
        carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || ""),
        driver_phone: formatPhoneHyphen(link.driver_phone || ""),
        attempts
      });
    }

    if (action === "attempts") {
      const token = extractToken(rawToken);
      if (!token) {
        return json(res, 400, { ok: false, error: "Missing Verification ID" });
      }

      const attempts = await sbFetchAttemptsByToken(token);
      return json(res, 200, {
        ok: true,
        token,
        attempts
      });
    }

    if (action === "lock") {
      const token = extractToken(rawToken);
      if (!token) {
        return json(res, 400, { ok: false, error: "Missing Verification ID" });
      }

      await sbPatchLinkByToken(token, { status: "locked" });

      return json(res, 200, {
        ok: true,
        status: "locked"
      });
    }

    if (action === "clear") {
      const token = extractToken(rawToken);
      if (!token) {
        return json(res, 400, { ok: false, error: "Missing Verification ID" });
      }

      await sbPatchLinkByToken(token, {
        status: "cleared",
        cleared_at: new Date().toISOString()
      });

      return json(res, 200, {
        ok: true,
        status: "cleared"
      });
    }

    return json(res, 400, { ok: false, error: "Unknown action" });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
