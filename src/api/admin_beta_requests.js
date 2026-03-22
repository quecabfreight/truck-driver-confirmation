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

function safeStr(v) {
  return String(v ?? "").trim();
}

function isAdminAuthorized(req) {
  const supplied = safeStr(req.headers["x-adbs-admin-key"]);
  const expected = safeStr(process.env.ADBS_ADMIN_KEY);
  return !!supplied && !!expected && supplied === expected;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  if (!isAdminAuthorized(req)) {
    return json(res, 401, { ok: false, error: "Unauthorized admin request." });
  }

  try {
    const status = safeStr(req.query?.status || "pending").toLowerCase();
    const limit = Math.max(1, Math.min(100, Number(req.query?.limit || 25)));
    const offset = Math.max(0, Number(req.query?.offset || 0));

    let query = supabase
      .from("beta_requests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status === "pending") {
      query = query.eq("status", "pending");
    } else if (status === "approved") {
      query = query.eq("status", "approved");
    }

    const { data, error, count } = await query;

    if (error) {
      return json(res, 500, { ok: false, error: error.message || "Could not load beta requests." });
    }

    return json(res, 200, {
      ok: true,
      rows: Array.isArray(data) ? data : [],
      total: Number.isFinite(count) ? count : 0
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
