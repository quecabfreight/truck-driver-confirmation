const BUILD_TAG = "verify-safe-write-first-01";

function json(res, code, obj) {
  res.status(code).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

function normalizeText(value) {
  return String(value ?? "").trim().toUpperCase();
}

async function sbSelectOne(table, query) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}?${query}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      Accept: "application/json",
    },
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Supabase SELECT failed (${resp.status}): ${text}`);
  }

  const rows = JSON.parse(text || "[]");
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function sbInsert(table, row) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Supabase INSERT failed (${resp.status}): ${text}`);
  }

  const rows = JSON.parse(text || "[]");
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function sbPatch(table, query, row) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${table}?${query}`;
  const resp = await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Supabase PATCH failed (${resp.status}): ${text}`);
  }

  const rows = JSON.parse(text || "[]");
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function sendCautionEmail({
  to,
  token,
  enteredUsdot,
  enteredPlate,
  driverAnswered,
  carrierCompany,
  carrierContactName,
  carrierContactPhone,
}) {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, skipped: true, reason: "Missing RESEND_API_KEY" };
  }

  if (!process.env.ADBS_EMAIL_FROM) {
    return { ok: false, skipped: true, reason: "Missing ADBS_EMAIL_FROM" };
  }

  if (!to) {
    return { ok: false, skipped: true, reason: "No alert recipient available" };
  }

  const subject = `CAUTION ALERT — DO NOT LOAD (${token})`;

  const html = `
    <div style="font-family:Arial,sans-serif;background:#0f1720;color:#e8eef7;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#18212c;border:1px solid #2c3948;border-radius:14px;overflow:hidden;">
        <div style="background:#7f1d1d;color:#fff;padding:18px 20px;font-size:22px;font-weight:800;">
          CAUTION ALERT — DO NOT LOAD
        </div>
        <div style="padding:20px;">
          <p style="font-size:15px;line-height:1.55;margin-top:0;">
            A Truck-Driver verification returned a caution result.
          </p>

          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Token</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${token || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Entered USDOT</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${enteredUsdot || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Entered Plate</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${enteredPlate || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Driver Answered</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${driverAnswered ? "YES" : "NO"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Carrier Company</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${carrierCompany || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Carrier Contact Name</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${carrierContactName || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#9fb1c7;">Carrier Contact Phone</td>
              <td style="padding:8px 0;color:#ffffff;font-weight:700;">${carrierContactPhone || "—"}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ADBS_EMAIL_FROM,
      to: [to],
      subject,
      html,
    }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Resend failed (${resp.status}): ${text}`);
  }

  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed", build_tag: BUILD_TAG });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const token = String(body.token ?? "").trim();
    const enteredUsdot = normalizeText(body.entered_usdot);
    const enteredPlate = normalizeText(body.entered_plate);
    const driverAnswered = Boolean(body.driver_answered);

    if (!token) {
      return json(res, 400, { ok: false, error: "Missing token", build_tag: BUILD_TAG });
    }

    const link = await sbSelectOne("verify_links", `token=eq.${encodeURIComponent(token)}&limit=1`);

    if (!link) {
      return json(res, 404, { ok: false, error: "Link not found", build_tag: BUILD_TAG });
    }

    const now = Date.now();
    const startsAt = link.starts_at ? new Date(link.starts_at).getTime() : null;
    const expiresAt = link.expires_at ? new Date(link.expires_at).getTime() : null;

    if (startsAt && now < startsAt) {
      return json(res, 403, { ok: false, error: "Verification not active yet", build_tag: BUILD_TAG });
    }

    if (expiresAt && now > expiresAt) {
      return json(res, 403, { ok: false, error: "Verification expired", build_tag: BUILD_TAG });
    }

    const expectedUsdot = normalizeText(link.usdot_on_record);
    const expectedPlate = normalizeText(link.plate_on_record);

    const usdotMatch = enteredUsdot && expectedUsdot && enteredUsdot === expectedUsdot;
    const plateMatch = enteredPlate && expectedPlate && enteredPlate === expectedPlate;

    const passed = Boolean(usdotMatch && plateMatch && driverAnswered);
    const result = passed ? "CLEAR TO LOAD" : "CAUTION ALERT — DO NOT LOAD";

    // WRITE FIRST: verification log
    await sbInsert("verify_checks", {
      token,
      entered_usdot: enteredUsdot,
      entered_plate: enteredPlate,
      driver_answered: driverAnswered,
      result,
      checked_at: new Date().toISOString(),
    });

    // WRITE SECOND: link status / last activity marker
    await sbPatch(
      "verify_links",
      `token=eq.${encodeURIComponent(token)}`,
      {
        status: passed ? "clear" : "caution",
      }
    );

    let email = { ok: false, skipped: true, reason: "Not needed" };

    // EMAIL THIRD: never let email failure kill verification writes
    if (!passed) {
      try {
        email = await sendCautionEmail({
          to:
            link.issuer_email ||
            link.broker_email ||
            process.env.ADBS_ALERT_TO ||
            process.env.ADBS_EMAIL_FROM,
          token,
          enteredUsdot,
          enteredPlate,
          driverAnswered,
          carrierCompany: link.carrier_company || "",
          carrierContactName: link.carrier_contact_name || link.dispatch_contact || "",
          carrierContactPhone: link.carrier_contact_phone || link.dispatch_phone || "",
        });
      } catch (err) {
        email = { ok: false, skipped: false, reason: err.message };
      }
    }

    return json(res, 200, {
      ok: true,
      build_tag: BUILD_TAG,
      result,
      usdot_match: usdotMatch,
      plate_match: plateMatch,
      driver_answered: driverAnswered,
      email,
    });
  } catch (err) {
    return json(res, 500, {
      ok: false,
      error: err.message || "Verification failed",
      build_tag: BUILD_TAG,
    });
  }
}
