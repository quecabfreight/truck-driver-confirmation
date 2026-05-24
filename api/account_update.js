import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function json(res, code, obj) {
  res.status(code);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function safe(v) {
  return String(v ?? "").trim();
}

function normalizeEmail(v) {
  return safe(v).toLowerCase();
}

function digits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhone(v) {
  const d = digits(v).slice(0, 10);

  if (!d) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;

  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function getBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return {};
}

async function findAccountByEmail(email) {
  const { data, error } = await supabase
    .from("broker_accounts")
    .select("*")
    .eq("business_email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Could not load account.");
  }

  return data || null;
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return json(res, 405, {
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, {
        ok: false,
        error: "Missing Supabase environment variables."
      });
    }

    if (req.method === "GET") {
      const email = normalizeEmail(req.query?.email);

      if (!email) {
        return json(res, 400, {
          ok: false,
          error: "Missing account email."
        });
      }

      const account = await findAccountByEmail(email);

      if (!account) {
        return json(res, 404, {
          ok: false,
          error: "Account not found."
        });
      }

      return json(res, 200, {
        ok: true,
        account: {
          business_email: account.business_email || "",
          contact_name: account.contact_name || "",
          business_phone: account.business_phone || "",
          company_name: account.company_name || "",
          role: account.role || "broker",
          status: account.status || "active"
        }
      });
    }

    const body = getBody(req);

    const currentEmail = normalizeEmail(body.current_email);
    const newEmail = normalizeEmail(body.business_email || body.email);
    const contactName = safe(body.contact_name);
    const businessPhone = formatPhone(body.business_phone || body.phone);

    if (!currentEmail) {
      return json(res, 400, {
        ok: false,
        error: "Current account email is required."
      });
    }

    if (!newEmail) {
      return json(res, 400, {
        ok: false,
        error: "Business email is required."
      });
    }

    if (!contactName) {
      return json(res, 400, {
        ok: false,
        error: "Contact name is required."
      });
    }

    if (digits(businessPhone).length !== 10) {
      return json(res, 400, {
        ok: false,
        error: "Business phone must be 10 digits."
      });
    }

    const existing = await findAccountByEmail(currentEmail);

    if (!existing) {
      return json(res, 404, {
        ok: false,
        error: "Account not found."
      });
    }

    if (newEmail !== currentEmail) {
      const emailCheck = await findAccountByEmail(newEmail);

      if (emailCheck) {
        return json(res, 409, {
          ok: false,
          error: "That business email is already tied to another account."
        });
      }
    }

    const { data, error } = await supabase
      .from("broker_accounts")
      .update({
        business_email: newEmail,
        contact_name: contactName,
        business_phone: businessPhone,
        updated_at: new Date().toISOString()
      })
      .eq("business_email", currentEmail)
      .select("*")
      .maybeSingle();

    if (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Could not update account."
      });
    }

    return json(res, 200, {
      ok: true,
      account: {
        business_email: data?.business_email || newEmail,
        contact_name: data?.contact_name || contactName,
        business_phone: data?.business_phone || businessPhone,
        company_name: data?.company_name || existing.company_name || "",
        role: data?.role || existing.role || "broker",
        status: data?.status || existing.status || "active"
      }
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err?.message || "Server error."
    });
  }
}
