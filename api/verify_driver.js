import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function normalizeDOT(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePlate(value) {
  return String(value || "").trim().toUpperCase();
}

function normalizeAnswered(value) {
  if (value === true) return true;
  if (value === false) return false;
  const v = String(value || "").trim().toUpperCase();
  return v === "YES" || v === "Y" || v === "TRUE";
}

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhoneHyphen(value) {
  const d = digitsOnly(value).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (!d) return "";
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function bestPhone(link) {
  const driver = formatPhoneHyphen(link?.driver_phone || "");
  const dispatch = formatPhoneHyphen(link?.dispatch_phone || "");
  return driver || dispatch || "";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const token = String(req.query?.token || "").trim();

      if (!token) {
        return res.status(400).json({ error: "Missing token" });
      }

      const { data: link, error } = await supabase
        .from("verify_links")
        .select("*")
        .eq("token", token)
        .maybeSingle();

      if (error) {
        return res.status(500).json({
          error: "Lookup failed",
          detail: error.message || String(error)
        });
      }

      if (!link) {
        return res.status(404).json({ error: "Verification link not found" });
      }

      return res.status(200).json({
        ok: true,
        driver_phone: bestPhone(link),
        carrier_company: String(link.carrier_company || ""),
        carrier_contact_name: String(link.dispatch_contact || ""),
        carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || ""),
        verification_id: token
      });
    } catch (err) {
      return res.status(500).json({
        error: "Failed to load verification info",
        detail: err?.message || String(err)
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token, entered_usdot, entered_plate, driver_answered } = req.body || {};

    if (!token) {
      return res.status(400).json({ error: "Missing token" });
    }

    const { data: link, error } = await supabase
      .from("verify_links")
      .select("*")
      .eq("token", token)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        error: "Lookup failed",
        detail: error.message || String(error)
      });
    }

    if (!link) {
      return res.status(404).json({ error: "Verification link not found" });
    }

    const phone = bestPhone(link);

    if (String(link.status || "").toLowerCase() === "cleared" || String(link.status || "").toLowerCase() === "used") {
      return res.status(200).json({
        result: "CLEAR_TO_LOAD",
        verification_id: token,
        verified_at: link.cleared_at || "",
        driver_phone: phone,
        carrier_company: String(link.carrier_company || ""),
        carrier_contact_name: String(link.dispatch_contact || ""),
        carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || "")
      });
    }

    const enteredDOT = normalizeDOT(entered_usdot);
    const enteredPlate = normalizePlate(entered_plate);
    const recordDOT = normalizeDOT(link.usdot_on_record);
    const recordPlate = normalizePlate(link.plate_on_record);
    const phoneMatch = normalizeAnswered(driver_answered);

    const dotMatch = enteredDOT === recordDOT;
    const plateMatch = enteredPlate === recordPlate;

    const result =
      dotMatch && plateMatch && phoneMatch
        ? "CLEAR_TO_LOAD"
        : "CAUTION_ALERT";

    const nowIso = new Date().toISOString();

    const { error: insertError } = await supabase.from("verify_checks").insert({
      token,
      entered_usdot: enteredDOT,
      entered_plate: enteredPlate,
      driver_answered: phoneMatch,
      result,
      checked_at: nowIso
    });

    if (insertError) {
      return res.status(500).json({
        error: "Failed to log verification attempt",
        detail: insertError.message || String(insertError)
      });
    }

    if (result === "CLEAR_TO_LOAD") {
      await supabase
        .from("verify_links")
        .update({
          status: "cleared",
          cleared_at: nowIso
        })
        .eq("token", token);
    }

    return res.status(200).json({
      result,
      verification_id: token,
      verified_at: new Date(nowIso).toLocaleString(),
      driver_phone: phone,
      carrier_company: String(link.carrier_company || ""),
      carrier_contact_name: String(link.dispatch_contact || ""),
      carrier_contact_phone: formatPhoneHyphen(link.dispatch_phone || "")
    });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected verify error",
      detail: err?.message || String(err)
    });
  }
}
