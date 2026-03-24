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

async function lookupByToken(token) {
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("token", token)
    .maybeSingle();
}

async function lookupByLoadId(loadId) {
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("load_id", loadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupByEmail(email) {
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("dock_email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupByDriverPhone(phone) {
  const pretty = formatPhoneHyphen(phone);
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("driver_phone", pretty)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupByCarrierCompany(company) {
  return await supabase
    .from("verify_links")
    .select("*")
    .ilike("carrier_company", company)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupByUsdot(usdot) {
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("usdot_on_record", onlyDigits(usdot))
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupByPlate(plate) {
  return await supabase
    .from("verify_links")
    .select("*")
    .eq("plate_on_record", safeStr(plate).toUpperCase())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

async function lookupAttempts(token) {
  const { data, error } = await supabase
    .from("verify_checks")
    .select("*")
    .eq("token", token)
    .order("checked_at", { ascending: false });

  if (error) throw new Error(error.message || "Could not load attempts.");
  return Array.isArray(data) ? data : [];
}

async function broadLookup(raw) {
  const q = safeStr(raw);
  if (!q) return null;

  const directToken = tokenFromAny(q);

  // 1) token / verify link / verification id
  {
    const { data, error } = await lookupByToken(directToken);
    if (error) throw new Error(error.message || "Token lookup failed.");
    if (data) return data;
  }

  // 2) load id
  {
    const { data, error } = await lookupByLoadId(q);
    if (error) throw new Error(error.message || "Load ID lookup failed.");
    if (data) return data;
  }

  // 3) email
  if (q.includes("@")) {
    const { data, error } = await lookupByEmail(q.toLowerCase());
    if (error) throw new Error(error.message || "Email lookup failed.");
    if (data) return data;
  }

  // 4) phone
  if (onlyDigits(q).length >= 7) {
    const { data, error } = await lookupByDriverPhone(q);
    if (error) throw new Error(error.message || "Phone lookup failed.");
    if (data) return data;
  }

  // 5) usdot
  if (onlyDigits(q).length >= 4) {
    const { data, error } = await lookupByUsdot(q);
    if (error) throw new Error(error.message || "USDOT lookup failed.");
    if (data) return data;
  }

  // 6) plate
  {
    const { data, error } = await lookupByPlate(q);
    if (error) throw new Error(error.message || "Plate lookup failed.");
    if (data) return data;
  }

  // 7) carrier company
  {
    const { data, error } = await lookupByCarrierCompany(q);
    if (error) throw new Error(error.message || "Carrier company lookup failed.");
    if (data) return data;
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const action = safeStr(body.action).toLowerCase();

    if (action !== "lookup") {
      return json(res, 400, { ok: false, error: "Unknown action." });
    }

    const raw = safeStr(body.token || body.query || body.search || "");
    if (!raw) {
      return json(res, 400, { ok: false, error: "Enter Verification ID, AdbS Verify Link, Load ID, email, phone, DOT, plate, or carrier." });
    }

    const link = await broadLookup(raw);

    if (!link) {
      return json(res, 404, { ok: false, error: "Verification not found." });
    }

    const attempts = await lookupAttempts(link.token);

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
      attempts
    });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e?.message || "Server error") });
  }
}
