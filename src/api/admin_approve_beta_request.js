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

    const admin_key = String(body.admin_key || "").trim();
    const id = String(body.id || "").trim();

    const ADBS_ADMIN_KEY = (process.env.ADBS_ADMIN_KEY || "").trim();
    const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
    const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

    if (!ADBS_ADMIN_KEY) return json(res, 500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if (!SUPABASE_URL) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SUPABASE_SERVICE_ROLE_KEY) return json(res, 500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    if (admin_key !== ADBS_ADMIN_KEY) {
      return json(res, 401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    if (!id) {
      return json(res, 400, { ok: false, error: "Missing id." });
    }

    // 1) Fetch the row first so we can:
    // - keep existing access_code (no regeneration)
    // - avoid re-approving/re-writing if already approved
    const getUrl =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=id,business_email,status,approved,access_code` +
      `&id=eq.${encodeURIComponent(id)}` +
      `&limit=1`;

    const g = await fetch(getUrl, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const gText = await g.text();
    let gData;
    try {
      gData = JSON.parse(gText);
    } catch {
      gData = gText;
    }

    if (!g.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (fetch row).", details: gData });
    }

    const row = Array.isArray(gData) ? gData[0] : null;
    if (!row) {
      return json(res, 404, { ok: false, error: "Request not found." });
    }

    const existingCode = String(row.access_code || "").trim();
    const alreadyApproved =
      row.approved === true || String(row.status || "").toLowerCase().trim() === "approved";

    // If already approved, do NOT change code/status. Just return what's already there.
    if (alreadyApproved) {
      return json(res, 200, {
        ok: true,
        note: "Already approved (no changes made).",
        access_code: existingCode || null,
        id: row.id,
        business_email: row.business_email || null,
      });
    }

    // If no code exists, generate one; otherwise keep existing.
    const finalCode = existingCode || makeCode();

    // 2) Patch approve + (maybe) set code
    const patchUrl = `${SUPABASE_URL}/rest/v1/beta_requests?id=eq.${encodeURIComponent(id)}`;

    const p = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        approved: true,
        status: "approved",
        access_code: finalCode,
      }),
    });

    const pText = await p.text();
    let pData;
    try {
      pData = JSON.parse(pText);
    } catch {
      pData = pText;
    }

    if (!p.ok) {
      return json(res, 500, { ok: false, error: "Supabase error (approve).", details: pData });
    }

    return json(res, 200, {
      ok: true,
      access_code: finalCode,
      updated: pData,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: "Server error (approve).",
      details: String(err?.message || err),
    });
  }
}

function makeCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `QC-${n}`;
}

function json(res, status, obj) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}
