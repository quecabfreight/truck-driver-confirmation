export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { ok: false, error: "Use POST." });
    }

    // Safe body parsing
    let body = {};
    try {
      if (typeof req.body === "object") body = req.body;
      else body = JSON.parse(req.body || "{}");
    } catch {
      body = {};
    }

    const business_email = String(body.business_email || "").trim().toLowerCase();
    const access_code = String(body.access_code || "").trim().toUpperCase();

    const usdot_on_record = digitsOnly(body.usdot_on_record);
    const plate_on_record = String(body.plate_on_record || "").trim();
    const driver_phone = String(body.driver_phone || "").trim();

    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SRK = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SRK) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    if (!business_email) return json(res, 400, { ok: false, error: "Missing business_email." });
    if (!access_code) return json(res, 400, { ok: false, error: "Missing access_code." });
    if (!usdot_on_record) return json(res, 400, { ok: false, error: "Enter USDOT (digits only)." });
    if (!plate_on_record) return json(res, 400, { ok: false, error: "Enter plate." });
    if (!driver_phone) return json(res, 400, { ok: false, error: "Enter driver phone." });

    // 1) Verify requester is approved
    const checkUrl =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=id,business_email,approved,status,access_code` +
      `&business_email=eq.${encodeURIComponent(business_email)}` +
      `&order=created_at.desc` +
      `&limit=10`;

    const c = await fetch(checkUrl, {
      method: "GET",
      headers: { apikey: SRK, Authorization: `Bearer ${SRK}` },
    });

    const cText = await c.text();
    let cData;
    try {
      cData = JSON.parse(cText);
    } catch {
      cData = cText;
    }

    if (!c.ok) return json(res, 500, { ok: false, error: "Supabase error (check user).", details: cData });

    const rows = Array.isArray(cData) ? cData : [];
    const match = rows.find((r) => String(r.access_code || "").toUpperCase().trim() === access_code);

    if (!match) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad email/code)." });
    }

    const approved =
      match.approved === true || String(match.status || "").toLowerCase().trim() === "approved";

    if (!approved) {
      return json(res, 403, { ok: false, error: "Not approved yet." });
    }

    // 2) Insert verify link
    const token = makeToken();
    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(); // +6 hours default

    const insertUrl = `${SUPABASE_URL}/rest/v1/verify_links`;

    const payload = {
      token,
      usdot_on_record,
      plate_on_record,
      driver_phone,
      status: "active",
      starts_at: nowIso,
      expires_at: expiresIso,
    };

    const ins = await fetch(insertUrl, {
      method: "POST",
      headers: {
        apikey: SRK,
        Authorization: `Bearer ${SRK}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    const insText = await ins.text();
    let insData;
    try {
      insData = JSON.parse(insText);
    } catch {
      insData = insText;
    }

    if (!ins.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (insert verify_links).", details: insData });
    }

    const origin = getOrigin(req);
    const verify_url = `${origin}/#/verify/${token}`;

    return json(res, 200, {
      ok: true,
      token,
      verify_url,
      expires_at: expiresIso,
    });
  } catch (err) {
    return json(res, 500, { ok: false, error: "Server error (issue link).", details: String(err?.message || err) });
  }
}

function digitsOnly(v) {
  return String(v || "").replace(/\D/g, "");
}

function makeToken() {
  // short, URL-safe, human-copyable
  const a = Math.random().toString(36).slice(2, 8);
  const b = Math.random().toString(36).slice(2, 8);
  return `${a}${b}`.toLowerCase();
}

function getOrigin(req) {
  const xfProto = req.headers["x-forwarded-proto"];
  const xfHost = req.headers["x-forwarded-host"];
  const host = xfHost || req.headers.host;
  const proto = (Array.isArray(xfProto) ? xfProto[0] : xfProto) || "https";
  return `${proto}://${host}`;
}

function json(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
