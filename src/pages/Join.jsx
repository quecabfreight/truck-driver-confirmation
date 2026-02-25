// /src/pages/Join.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}
function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function Join() {
  const nav = useNavigate();

  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("Broker"); // Broker | Shipper
  const [mc, setMc] = useState(""); // digits only (store digits)
  const [ein, setEin] = useState(""); // optional
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const payload = useMemo(() => {
    return {
      legal_business_name: String(legalName || "").trim(),
      contact_name: String(contactName || "").trim(),
      role: role,
      mc_number: mc ? `MC${onlyDigits(mc)}` : "",
      ein: String(ein || "").trim() || null,
      business_phone: formatPhoneHyphen(phone),
      email: String(email || "").trim(),
    };
  }, [legalName, contactName, role, mc, ein, phone, email]);

  async function submit() {
    setOkMsg("");
    setErrMsg("");

    if (!payload.legal_business_name) return setErrMsg("Enter Name or Legal Business Name.");
    if (!payload.contact_name) return setErrMsg("Enter Contact Name.");
    if (!payload.email || !payload.email.includes("@")) return setErrMsg("Enter a valid Business Email.");
    if (!onlyDigits(payload.business_phone) || onlyDigits(payload.business_phone).length !== 10)
      return setErrMsg("Enter Business Phone (10 digits).");
    if (!onlyDigits(payload.mc_number).length) return setErrMsg("Enter MC# digits.");

    setLoading(true);
    try {
      // Try the most likely endpoint names (covers older builds too).
      const endpoints = ["/api/requestAccessApi", "/api/request_access", "/api/request_access_code"];

      let lastText = "";
      let res = null;

      for (const url of endpoints) {
        // eslint-disable-next-line no-await-in-loop
        res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // eslint-disable-next-line no-await-in-loop
        lastText = await res.text();

        if (res.ok) break; // success
        // if 404, try the next endpoint
        if (res.status === 404) continue;
        // if not 404, stop trying (real error)
        break;
      }

      let data = null;
      try {
        data = JSON.parse(lastText);
      } catch {
        data = { raw: lastText };
      }

      if (!res || !res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Request failed (${res ? res.status : "no response"}).`;
        setErrMsg(msg);
        return;
      }

      setOkMsg("Request received. QueCab AdbS will review and contact you with next steps.");
    } catch {
      setErrMsg("Network error submitting request.");
    } finally {
      setLoading(false);
    }
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };
  const sub = { opacity: 0.85, marginTop: 8, lineHeight: 1.4 };

  const label = { fontSize: 14, opacity: 0.92, marginBottom: 6 };
  const input = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 16,
    outline: "none",
  };

  const btn = (primary) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  });

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <h1 style={h1}>Request Access</h1>
          <div style={sub}>
            Beta access for brokers and shippers. Submit your business details and we’ll review.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
              marginTop: 14,
            }}
          >
            <div>
              <div style={label}>Name or Legal Business Name</div>
              <input
                style={input}
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Company or personal name"
                autoComplete="organization"
              />
            </div>

            <div>
              <div style={label}>Contact Name</div>
              <input
                style={input}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div>
              <div style={label}>Role</div>
              <select
                style={input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Broker">Broker</option>
                <option value="Shipper">Shipper</option>
              </select>
            </div>

            <div>
              <div style={label}>MC# (digits)</div>
              <input
                style={input}
                value={onlyDigits(mc)}
                onChange={(e) => setMc(onlyDigits(e.target.value))}
                placeholder="e.g. 1568436"
                inputMode="numeric"
                autoComplete="off"
              />
            </div>

            <div>
              <div style={label}>Business Phone</div>
              <input
                style={input}
                value={phone}
                onChange={(e) => setPhone(formatPhoneHyphen(e.target.value))}
                placeholder="123-456-7890"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div>
              <div style={label}>Business Email</div>
              <input
                style={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                inputMode="email"
                autoComplete="email"
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div style={label}>EIN (optional)</div>
              <input
                style={input}
                value={ein}
                onChange={(e) => setEin(e.target.value)}
                placeholder="Optional"
                autoComplete="off"
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <button style={btn(true)} onClick={submit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <button style={btn(false)} onClick={() => nav("/login")} type="button">
              Already Authorized? Log In
            </button>
          </div>

          {errMsg ? (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(255,80,80,0.35)",
                background: "rgba(255,80,80,0.08)",
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              <b>Error:</b> {errMsg}
            </div>
          ) : null}

          {okMsg ? (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(120,180,255,0.30)",
                background: "rgba(120,180,255,0.08)",
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {okMsg}
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 14, opacity: 0.7, fontSize: 12 }}>
          Tip: MC# is stored as digits and displayed as MC####### automatically.
        </div>
      </div>
    </div>
  );
}
