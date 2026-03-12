import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase();
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

function makeQrDataUrl(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(clean)}`;
}

function nowLocalDatetime() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function plusHoursLocalDatetime(hours) {
  const d = new Date(Date.now() + hours * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDisplayDate(value) {
  if (!value) return "No Expire";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

async function safeCopy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export default function ControlCenter() {
  const nav = useNavigate();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  const loadIdRef = useRef(null);
  const driverPhoneRef = useRef(null);
  const usdotRef = useRef(null);
  const plateRef = useRef(null);

  useEffect(() => {
    if (!authorized) {
      nav("/login", { replace: true });
      return;
    }
    setTimeout(() => {
      loadIdRef.current?.focus();
    }, 0);
  }, [authorized, nav]);

  if (!authorized) return null;

  const [loadId, setLoadId] = useState("");
  const [dockEmail, setDockEmail] = useState("");
  const [dockPin, setDockPin] = useState("");
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [carrierCompany, setCarrierCompany] = useState("");
  const [carrierContactName, setCarrierContactName] = useState("");
  const [carrierContactPhone, setCarrierContactPhone] = useState("");

  const [mode, setMode] = useState("auto");
  const [startsAt, setStartsAt] = useState(() => nowLocalDatetime());
  const [expiresAt, setExpiresAt] = useState(() => plusHoursLocalDatetime(24));

  const [searchId, setSearchId] = useState("");

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [issued, setIssued] = useState(null);
  const [issuedQr, setIssuedQr] = useState("");
  const [attempts, setAttempts] = useState([]);

  const [totals, setTotals] = useState({
    verifications: 0,
    cleared: 0,
    caution: 0
  });

  useEffect(() => {
    loadTotals();
  }, []);

  async function safeJson(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  async function loadTotals() {
    try {
      const res = await fetch("/api/dashboard_totals");
      const data = await safeJson(res);
      if (res.ok) {
        setTotals({
          verifications: Number(data.verifications || 0),
          cleared: Number(data.cleared || 0),
          caution: Number(data.caution || 0)
        });
      }
    } catch {}
  }

  function clearNextLoadFields() {
    setLoadId("");
    setDockEmail("");
    setDockPin("");
    setUsdotOnRecord("");
    setPlateOnRecord("");
    setDriverPhone("");
    setCarrierCompany("");
    setCarrierContactName("");
    setCarrierContactPhone("");
    setStartsAt(nowLocalDatetime());
    setExpiresAt(plusHoursLocalDatetime(24));
    setMode("auto");
  }

  async function searchVerification() {
    setErrorMsg("");
    setStatusMsg("");
    setAttempts([]);

    if (!searchId.trim()) {
      setErrorMsg("Enter Verification ID");
      return;
    }

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lookup",
          token: searchId.trim()
        })
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data.error || "Verification not found");
        return;
      }

      const verifyUrl = data.verify_url || "";
      setIssued({
        verification_id: data.token,
        verify_url: verifyUrl,
        status: data.status || "active",
        expires_at: data.expires_at || null,
        load_id: data.load_id || null,
        carrier_company: data.carrier_company || null,
        carrier_contact_name: data.carrier_contact_name || null,
        carrier_contact_phone: data.carrier_contact_phone || null
      });
      setIssuedQr(makeQrDataUrl(verifyUrl));
      setAttempts(Array.isArray(data.attempts) ? data.attempts : []);
      setStatusMsg("Verification loaded.");
    } catch {
      setErrorMsg("Search failed.");
    }
  }

  async function issueLink() {
    setErrorMsg("");
    setStatusMsg("");
    setAttempts([]);

    const usdot_digits = onlyDigits(usdotOnRecord);
    const plate_upper = toUpperClean(plateOnRecord).trim();
    const phone_digits = onlyDigits(driverPhone);
    const carrierPhoneFormatted = formatPhoneHyphen(carrierContactPhone);

    if (!usdot_digits) {
      setErrorMsg("Enter USDOT#");
      usdotRef.current?.focus();
      return;
    }

    if (!plate_upper) {
      setErrorMsg("Enter Plate");
      plateRef.current?.focus();
      return;
    }

    if (phone_digits.length !== 10) {
      setErrorMsg("Enter Driver Phone");
      driverPhoneRef.current?.focus();
      return;
    }

    let starts_at = null;
    let expires_at = null;

    if (mode === "auto") {
      starts_at = new Date().toISOString();
      expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      setStartsAt(nowLocalDatetime());
      setExpiresAt(plusHoursLocalDatetime(24));
    } else if (mode === "pick") {
      if (!startsAt || !expiresAt) {
        setErrorMsg("Choose Start and Expire");
        return;
      }
      starts_at = new Date(startsAt).toISOString();
      expires_at = new Date(expiresAt).toISOString();
    } else {
      starts_at = new Date().toISOString();
      expires_at = null;
    }

    setLoading(true);

    try {
      const payload = {
        load_id: loadId || null,
        dock_email: dockEmail || null,
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
        dock_pin: dockPin || null,
        starts_at,
        expires_at,
        carrier_company: carrierCompany || null,
        dispatch_contact: carrierContactName || null,
        dispatch_phone: carrierPhoneFormatted || null
      };

      const res = await fetch("/api/issue_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data.error || "Issue failed");
        setLoading(false);
        return;
      }

      const verifyUrl = data.verify_url || "";

      setIssued({
        verification_id: data.token,
        verify_url: verifyUrl,
        status: data.status || "active",
        expires_at: data.expires_at || expires_at,
        load_id: payload.load_id,
        carrier_company: payload.carrier_company,
        carrier_contact_name: payload.dispatch_contact,
        carrier_contact_phone: payload.dispatch_phone
      });

      setIssuedQr(makeQrDataUrl(verifyUrl));
      setStatusMsg("AdbS Verification issued.");
      loadTotals();
      clearNextLoadFields();
    } catch {
      setErrorMsg("Network error");
    }

    setLoading(false);
  }

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12,18,28,0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  };

  const input = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.32)",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    fontSize: 16,
    outline: "none"
  };

  const btn = (primary) => ({
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.55)"
      : "1px solid rgba(255,255,255,0.18)",
    background: primary
      ? "rgba(40,110,190,0.35)"
      : "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer"
  });

  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? "1px solid rgba(120,180,255,0.55)" : "1px solid rgba(255,255,255,0.18)",
    background: active ? "rgba(40,110,190,0.35)" : "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontWeight: 900,
    textAlign: "center",
    cursor: "pointer"
  });

  const sectionTitle = {
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 12,
    color: "#ffffff"
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" }}>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 14, color: "#ffffff" }}>
          Control Center
        </div>

        <div style={{ ...card, marginBottom: 16 }}>
          <div style={sectionTitle}>Find Verification</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
            <input
              style={input}
              placeholder="Verification ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button style={btn(true)} onClick={searchVerification}>Search</button>
          </div>
        </div>

        <div style={{ ...card, marginBottom: 16 }}>
          <div style={sectionTitle}>AdbS Protection Summary</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, fontSize: 15 }}>
            <div>
              <div style={{ opacity: 0.72 }}>Truck-Driver Verifications</div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{totals.verifications}</div>
            </div>

            <div>
              <div style={{ opacity: 0.72 }}>Cleared Loads</div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{totals.cleared}</div>
            </div>

            <div>
              <div style={{ opacity: 0.72 }}>Caution Alerts</div>
              <div style={{ fontWeight: 900, fontSize: 22 }}>{totals.caution}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 16 }}>
          <div style={card}>
            <div style={sectionTitle}>Issue AdbS Verification</div>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                ref={loadIdRef}
                style={input}
                placeholder="Load ID"
                value={loadId}
                onChange={(e) => setLoadId(e.target.value)}
              />

              <input
                style={input}
                placeholder="Dock Email"
                value={dockEmail}
                onChange={(e) => setDockEmail(e.target.value)}
              />

              <input
                style={input}
                placeholder="Dock PIN"
                value={dockPin}
                onChange={(e) => setDockPin(onlyDigits(e.target.value))}
              />

              <input
                ref={driverPhoneRef}
                style={input}
                placeholder="Driver Phone"
                value={driverPhone}
                onChange={(e) => setDriverPhone(formatPhoneHyphen(e.target.value))}
              />

              <input
                ref={usdotRef}
                style={input}
                placeholder="USDOT#"
                value={usdotOnRecord}
                onChange={(e) => setUsdotOnRecord(onlyDigits(e.target.value))}
              />

              <input
                ref={plateRef}
                style={input}
                placeholder="Plate"
                value={plateOnRecord}
                onChange={(e) => setPlateOnRecord(toUpperClean(e.target.value))}
              />

              <input
                style={input}
                placeholder="Carrier Company (optional)"
                value={carrierCompany}
                onChange={(e) => setCarrierCompany(e.target.value)}
              />

              <input
                style={input}
                placeholder="Carrier Contact Name (optional)"
                value={carrierContactName}
                onChange={(e) => setCarrierContactName(e.target.value)}
              />

              <input
                style={input}
                placeholder="Carrier Contact Phone (optional)"
                value={carrierContactPhone}
                onChange={(e) => setCarrierContactPhone(formatPhoneHyphen(e.target.value))}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={chip(mode === "auto")} onClick={() => setMode("auto")}>Auto 24h</div>
                <div style={chip(mode === "pick")} onClick={() => setMode("pick")}>Pick</div>
                <div style={chip(mode === "none")} onClick={() => setMode("none")}>No Expire</div>
              </div>

              {mode === "pick" && (
                <>
                  <input
                    style={input}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                  />
                  <input
                    style={input}
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </>
              )}

              <button style={btn(true)} onClick={issueLink} disabled={loading}>
                {loading ? "Issuing..." : "Issue AdbS Verification"}
              </button>

              {errorMsg && <div style={{ color: "#ff7b7b" }}>{errorMsg}</div>}
              {statusMsg && <div style={{ color: "#ffffff" }}>{statusMsg}</div>}
            </div>

            {issued && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 900, color: "#ffffff" }}>Verification ID</div>
                <input style={input} value={issued.verification_id || ""} readOnly />

                <div style={{ marginTop: 10, fontWeight: 900, color: "#ffffff" }}>AdbS SmartLink</div>
                <input style={input} value={issued.verify_url || ""} readOnly />

                <div style={{ marginTop: 10, fontWeight: 900, color: "#ffffff" }}>Status</div>
                <input style={input} value={issued.status || ""} readOnly />

                <div style={{ marginTop: 10, fontWeight: 900, color: "#ffffff" }}>Expires</div>
                <input style={input} value={formatDisplayDate(issued.expires_at)} readOnly />

                {(issued.carrier_company || issued.carrier_contact_name || issued.carrier_contact_phone) && (
                  <div style={{ marginTop: 14, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ fontWeight: 900, marginBottom: 8, color: "#ffffff" }}>Carrier Contact</div>

                    {issued.carrier_company ? (
                      <div style={{ marginBottom: 6 }}>
                        Carrier Company: <b>{issued.carrier_company}</b>
                      </div>
                    ) : null}

                    {issued.carrier_contact_name ? (
                      <div style={{ marginBottom: 6 }}>
                        Carrier Contact Name: <b>{issued.carrier_contact_name}</b>
                      </div>
                    ) : null}

                    {issued.carrier_contact_phone ? (
                      <div>
                        Carrier Contact Phone: <b>{issued.carrier_contact_phone}</b>
                      </div>
                    ) : null}
                  </div>
                )}

                <div style={{ marginTop: 14, textAlign: "center" }}>
                  {issuedQr && (
                    <img
                      src={issuedQr}
                      alt="QR"
                      style={{ width: 240, background: "#fff", padding: 10, borderRadius: 10 }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={card}>
            <div style={sectionTitle}>Load Activity</div>

            {!attempts.length && (
              <div style={{ opacity: 0.72, fontSize: 14 }}>
                No verification attempts yet.
              </div>
            )}

            {attempts.map((a, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 8
                }}
              >
                <div style={{ fontWeight: 900 }}>
                  {String(a.result || "").toLowerCase().includes("clear") ? "CLEAR" : "ATTEMPT"}
                </div>

                <div style={{ fontSize: 13 }}>
                  DOT: <b>{a.entered_usdot}</b>
                  <br />
                  Plate: <b>{a.entered_plate}</b>
                  <br />
                  Driver Answered: <b>{String(a.driver_answered)}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
