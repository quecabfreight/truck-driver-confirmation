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

function onlyDigits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhoneHyphen(v) {
  const d = onlyDigits(v).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function tokenFromAny(raw) {
  const s = safeStr(raw);
  if (!s) return "";

  try {
    if (s.includes("http://") || s.includes("https://")) {
      const u = new URL(s);
      const t = u.searchParams.get("t");
      if (t) return t.trim();
    }
  } catch {}

  const m = s.match(/[?&]t=([A-Za-z0-9\-_]+)/);
  if (m?.[1]) return m[1].trim();

  return s;
}

function buildVerifyUrl(req, token) {
  const origin =
    (req.headers["x-forwarded-proto"] ? `${req.headers["x-forwarded-proto"]}://` : "https://") +
    (req.headers["x-forwarded-host"] || req.headers.host || "localhost");

  return `${origin}/v.html?t=${token}&cv=4`;
}

async function fetchAttemptsForToken(token) {
  const { data, error } = await supabase
    .from("verify_checks")
    .select("*")
    .eq("token", token)
    .order("checked_at", { ascending: false });

  if (error) throw new Error(error.message || "Could not load attempts.");
  return Array.isArray(data) ? data : [];
}

function summarizeResult(attempts, status) {
  if (Array.isArray(attempts) && attempts.length > 0) {
    const latest = attempts[0];
    return safeStr(latest.result || status || "active");
  }
  return safeStr(status || "active");
}

function compactRow(req, link, attempts = []) {
  return {
    token: link.token,
    verification_id: link.token,
    verify_url: buildVerifyUrl(req, link.token),
    load_id: safeStr(link.load_id),
    status: safeStr(link.status || "active"),
    result_summary: summarizeResult(attempts, link.status),
    attempts_count: Array.isArray(attempts) ? attempts.length : 0,
    dock_email: safeStr(link.dock_email),
    driver_phone: safeStr(link.driver_phone),
    usdot_on_record: safeStr(link.usdot_on_record),
    plate_on_record: safeStr(link.plate_on_record),
    carrier_company: safeStr(link.carrier_company),
    carrier_contact_name: safeStr(link.dispatch_contact),
    carrier_contact_phone: safeStr(link.dispatch_phone),
    created_at: link.created_at || "",
    expires_at: link.expires_at || null
  };
}

async function fetchLinkByToken(token) {
  const { data, error } = await supabase
    .from("verify_links")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) throw new Error(error.message || "Token lookup failed.");
  return data || null;
}

async function fetchManyByField(field, value, mode = "eq") {
  let query = supabase
    .from("verify_links")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(25);

  if (mode === "ilike") {
    query = query.ilike(field, value);
  } else {
    query = query.eq(field, value);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message || `${field} lookup failed.`);
  return Array.isArray(data) ? data : [];
}

async function broadLookupMany(raw) {
  const q = safeStr(raw);
  if (!q) return [];

  const directToken = tokenFromAny(q);

  // 1) token / verify link / verification id -> unique
  {
    const link = await fetchLinkByToken(directToken);
    if (link) return [link];
  }

  // 2) load id
  {
    const rows = await fetchManyByField("load_id", q, "eq");
    if (rows.length) return rows;
  }

  // 3) email
  if (q.includes("@")) {
    const rows = await fetchManyByField("dock_email", q.toLowerCase(), "eq");
    if (rows.length) return rows;
  }

  // 4) phone
  if (onlyDigits(q).length >= 7) {
    const rows = await fetchManyByField("driver_phone", formatPhoneHyphen(q), "eq");
    if (rows.length) return rows;
  }

  // 5) usdot
  if (onlyDigits(q).length >= 4) {
    const rows = await fetchManyByField("usdot_on_record", onlyDigits(q), "eq");
    if (rows.length) return rows;
  }

  // 6) plate
  {
    const rows = await fetchManyByField("plate_on_record", q.toUpperCase(), "eq");
    if (rows.length) return rows;
  }

  // 7) carrier company
  {
    const rows = await fetchManyByField("carrier_company", `%${q}%`, "ilike");
    if (rows.length) return rows;
  }

  return [];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const action = safeStr(body.action).toLowerCase();

    if (action === "lookup") {
      const raw = safeStr(body.token || body.query || body.search || "");
      if (!raw) {
        return json(res, 400, {
          ok: false,
          error: "Enter Verification ID, AdbS Verify Link, Load ID, email, phone, DOT, plate, or carrier"
        });
      }

      const rows = await broadLookupMany(raw);

      if (!rows.length) {
        return json(res, 404, { ok: false, error: "Verification not found." });
      }

      const compactRows = [];
      for (const row of rows) {
        const attempts = await fetchAttemptsForToken(row.token);
        compactRows.push(compactRow(req, row, attempts));
      }

      return json(res, 200, {
        ok: true,
        mode: compactRows.length > 1 ? "multi" : "single",
        rows: compactRows
      });
    }

    if (action === "detail") {
      const token = safeStr(body.token);
      if (!token) {
        return json(res, 400, { ok: false, error: "Missing token." });
      }

      const link = await fetchLinkByToken(token);
      if (!link) {
        return json(res, 404, { ok: false, error: "Verification not found." });
      }

      const attempts = await fetchAttemptsForToken(token);

      return json(res, 200, {
        ok: true,
        token: link.token,
        verify_url: buildVerifyUrl(req, link.token),
        status: link.status || "active",
        expires_at: link.expires_at || null,
        load_id: link.load_id || "",
        dock_email: link.dock_email || "",
        driver_phone: link.driver_phone || "",
        usdot_on_record: link.usdot_on_record || "",
        plate_on_record: link.plate_on_record || "",
        carrier_company: link.carrier_company || "",
        carrier_contact_name: link.dispatch_contact || "",
        carrier_contact_phone: link.dispatch_phone || "",
        created_at: link.created_at || "",
        attempts
      });
    }

    return json(res, 400, { ok: false, error: "Unknown action." });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
