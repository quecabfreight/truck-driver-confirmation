// /api/manage_verify_link.js
// Broker control levers for AdbS:
// - reissue
// - lock
// - clear
// - attempts

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function sbHeaders() {
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpper(s) {
  return String(s || "").toUpperCase();
}

async function safeJsonResponse(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
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
    headers: sbHeaders(),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load verify link.");
  return Array.isArray(data) ? data[0] || null : null;
}

async function sbFetchAttemptsByToken(token) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_checks` +
    `?token=eq.${encodeURIComponent(token)}` +
    `&select=*` +
    `&order=created_at.desc`;

  const res = await fetch(url, {
    method: "GET",
    headers: sbHeaders(),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load attempts.");
  return Array.isArray(data) ? data : [];
}

async function sbPatchLinkById(id, patch) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const url =
    `${SUPABASE_URL}/rest/v1/verify_links` +
    `?id=eq.${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify(patch),
  });

  const data = await safeJsonResponse(res);
  if (!res.ok) throw new Error(data?.message || data?.error || "Failed to update verify link.");
  return Array.isArray(data) ? data[0] || null : data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !KEY) {
    return json(res, 500, { ok: false, error: "Missing Supabase env." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const action = String(body.action || "").trim().toLowerCase();
    const token = String(body.token || "").trim();

    if (!token) return json(res, 400, { ok: false, error: "Missing token." });
    if (!action) return json(res, 400, { ok: false, error: "Missing action." });

    const link = await sbFetchOneByToken(token);
    if (!link) return json(res, 404, { ok: false, error: "Verification link not found." });

    if (action === "attempts") {
      const attempts = await sbFetchAttemptsByToken(token);
      return json(res, 200, {
        ok: true,
        token,
        attempts,
      });
    }

    if (action === "lock") {
      const updated = await sbPatchLinkById(link.id, {
        status: "locked",
      });

      return json(res, 200, {
        ok: true,
        action: "lock",
        token,
        status: updated?.status || "locked",
      });
    }

    if (action === "clear") {
      const updated = await sbPatchLinkById(link.id, {
        status: "cleared",
      });

      return json(res, 200, {
        ok: true,
        action: "clear",
        token,
        status: updated?.status || "cleared",
      });
    }

    if (action === "reissue") {
      const load_id = String(link.load_id || "").trim() || null;
      const usdot_on_record = onlyDigits(link.usdot_on_record || "");
      const plate_on_record = toUpper(link.plate_on_record || "").trim();
      const driver_phone = String(link.driver_phone || "").trim();
      const dock_pin = String(link.dock_pin || "").trim() || null;

      const origin =
        (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
        (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

      const issueRes = await fetch(`${origin}/api/issue_verify_link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          load_id,
          dock_email: body.dock_email || null,
          usdot_on_record,
          plate_on_record,
          driver_phone,
          dock_pin,
          starts_at: new Date().toISOString(),
          expires_at: link.expires_at || null,
        }),
      });

      const issueData = await safeJsonResponse(issueRes);
      if (!issueRes.ok) {
        throw new Error(issueData?.error || issueData?.message || "Reissue failed.");
      }

      await sbPatchLinkById(link.id, {
        status: "reissued",
      });

      return json(res, 200, {
        ok: true,
        action: "reissue",
        old_token: token,
        new_token: issueData?.token || null,
        verify_url: issueData?.verify_url || null,
        email_status: issueData?.email_status || null,
        email_error: issueData?.email_error || null,
      });
    }

    return json(res, 400, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
