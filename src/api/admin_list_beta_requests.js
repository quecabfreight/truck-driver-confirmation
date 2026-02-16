export const config = { runtime: "nodejs" };

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getEnv(name) {
  const v = process.env[name];
  return (v || "").trim();
}

function safeEq(a, b) {
  return String(a || "").trim() === String(b || "").trim();
}

export async function GET() {
  return json(405, { ok: false, error: "Use POST." });
}

export async function POST(request) {
  try {
    const ADBS_ADMIN_KEY = getEnv("ADBS_ADMIN_KEY");
    const SUPABASE_URL = getEnv("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

    if (!ADBS_ADMIN_KEY) return json(500, { ok: false, error: "Missing env: ADBS_ADMIN_KEY" });
    if (!SUPABASE_URL) return json(500, { ok: false, error: "Missing env: SUPABASE_URL" });
    if (!SUPABASE_SERVICE_ROLE_KEY) return json(500, { ok: false, error: "Missing env: SUPABASE_SERVICE_ROLE_KEY" });

    const body = await request.json().catch(() => ({}));
    const admin_key = (body?.admin_key || "").toString().trim();

    if (!safeEq(admin_key, ADBS_ADMIN_KEY)) {
      return json(401, { ok: false, error: "Unauthorized (bad admin key)." });
    }

    // Pull latest 50 beta requests
    const url =
      `${SUPABASE_URL}/rest/v1/beta_requests` +
      `?select=id,created_at,business_email,status,approved,access_code,name,legal_name,legal_business_name,business_name,role,business_phone,phone` +
      `&order=created_at.desc` +
      `&limit=50`;

    const r = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!r.ok) {
      return json(500, { ok: false, error: "Supabase error (list).", details: data });
    }

    return json(200, { ok: true, rows: Array.isArray(data) ? data : [] });
  } catch (err) {
    return json(500, { ok: false, error: "Server error (list).", details: String(err?.message || err) });
  }
}
