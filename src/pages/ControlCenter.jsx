import React, { useEffect, useRef, useState } from "react";
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
  const usdotRef = useRef(null);
  const plateRef = useRef(null);
  const driverPhoneRef = useRef(null);

  const [loadId, setLoadId] = useState("");
  const [dockEmail, setDockEmail] = useState("");
  const [carrierCompany, setCarrierCompany] = useState("");
  const [carrierContact, setCarrierContact] = useState("");
  const [carrierPhone, setCarrierPhone] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");
  const [dockPin, setDockPin] = useState("");

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

  useEffect(() => {
    if (!authorized) {
      nav("/login", { replace: true });
      return;
    }
    const t = setTimeout(() => {
      loadIdRef.current?.focus();
      loadIdRef.current?.select?.();
    }, 0);
    return () => clearTimeout(t);
  }, [authorized, nav]);

  if (!authorized) return null;

  async function safeJson(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  function clearIssuedForm() {
    setLoadId("");
    setDockEmail("");
    setCarrierCompany("");
    setCarrierContact("");
    setCarrierPhone("");
    setDriverPhone("");
    setUsdotOnRecord("");
    setPlateOnRecord("");
    setDockPin("");
    setMode("auto");
    setStartsAt(nowLocalDatetime());
    setExpiresAt(plusHoursLocalDatetime(24));
  }

  async function issueLink() {
    setErrorMsg("");
    setStatusMsg("");
    setAttempts([]);
    setIssuedQr("");

    const usdot_digits = onlyDigits(usdotOnRecord);
    const plate_upper = toUpperClean(plateOnRecord).trim();
    const driver_digits = onlyDigits(driverPhone);

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

    if (driver_digits.length !== 10) {
      setErrorMsg("Enter Driver Phone");
      driverPhoneRef.current?.focus();
      return;
    }

    let starts_at = new Date().toISOString();
    let expires_at = null;

    if (mode === "auto") {
      expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    } else if (mode === "pick") {
      if (!startsAt || !expiresAt) {
        setErrorMsg("Choose Start and Expire");
        return;
      }
      starts_at = new Date(startsAt).toISOString();
      expires_at = new Date(expiresAt).toISOString();
    } else {
      expires_at = null;
    }

    setLoading(true);

    try {
      const payload = {
        load_id: String(loadId || "").trim() || null,
        dock_email: String(dockEmail || "").trim() || null,
        carrier_company: String(carrierCompany || "").trim() || null,
        dispatch_contact: String(carrierContact || "").trim() || null,
        dispatch_phone: formatPhoneHyphen(carrierPhone),
        driver_phone: formatPhoneHyphen(driverPhone),
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        dock_pin: String(dockPin || "").trim() || null,
        starts_at,
        expires_at
      };

      const res = await fetch("/api/issue_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data?.error || "Issue failed");
        setLoading(false);
        return;
      }

      const verifyUrl = data?.verify_url || "";
      const qrDataUrl = makeQrDataUrl(verifyUrl);

      setIssued({
        verification_id: data?.token || "",
        verify_url: verifyUrl,
        status: data?.status || "active",
        expires_at: data?.expires_at || expires_at || null,
        carrier_company: payload.carrier_company || "",
        carrier_contact_name: payload.dispatch_contact || "",
        carrier_contact_phone: payload.dispatch_phone || "",
        email_status: data?.email_status || "",
        email_error: data?.email_error || "",
        email_debug: data?.email_debug || null
      });

      setIssuedQr(qrDataUrl);
      setStatusMsg("AdbS Verification issued");
      clearIssuedForm();
    } catch {
      setErrorMsg("Network error");
    }

    setLoading(false);
  }

  async function searchVerification() {
    setErrorMsg("");
    setStatusMsg("");
    setAttempts([]);

    const raw = String(searchId || "").trim();
    if (!raw) {
      setErrorMsg("Enter Verification ID, SmartLink, or Load ID");
      return;
    }

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "lookup",
          token: raw
        })
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data?.error || "Verification not found");
        return;
      }

      setIssued({
        verification_id: data?.token || "",
        verify_url: data?.verify_url || "",
        status: data?.status || "active",
        expires_at: data?.expires_at || null,
        carrier_company: data?.carrier_company || "",
        carrier_contact_name: data?.carrier_contact_name || "",
        carrier_contact_phone: data?.carrier_contact_phone || "",
        email_status: "",
        email_error: "",
        email_debug: null
      });

      setIssuedQr(makeQrDataUrl(data?.verify_url || ""));
      setAttempts(Array.isArray(data?.attempts) ? data.attempts : []);
      setStatusMsg("Verification loaded.");
    } catch {
      setErrorMsg("Search failed");
    }
  }

  const pageWrap = {
    minHeight: "100vh",
    background: "transparent"
  };

  const outer = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "18px 16px 48px"
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12,18,28,0.72)",
    borderRadius: 18,
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
    color: "#fff",
    fontSize: 16,
    outline: "none"
  };

  const buttonPrimary = {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer"
  };

  const buttonSoft = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer"
  };

  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active
      ? "1px solid rgba(120,180,255,0.55)"
      : "1px solid rgba(255,255,255,0.18)",
    background: active
      ? "rgba(40,110,190,0.35)"
      : "rgba(255,255,255,0.06)",
    color: "#fff",
    fontWeight: 900,
    textAlign: "center",
    cursor: "pointer"
  });

  const title = {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 14,
    color: "#fff"
  };

  const sectionTitle = {
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 12,
    color: "#fff"
  };

  return (
    <div style={pageWrap}>
      <Header />

      <div style={outer}>
        <div style={title}>Control Center</div>

        <div style={{ ...card, marginBottom: 16 }}>
          <div style={sectionTitle}>Find Verification</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 170px", gap: 10 }}>
            <input
              style={input}
              placeholder="Verification ID, SmartLink, or Load ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button style={buttonPrimary} onClick={searchVerification}>
              Search
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: 16 }}>
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
                placeholder="Carrier Company"
                value={carrierCompany}
                onChange={(e) => setCarrierCompany(e.target.value)}
              />

              <input
                style={input}
                placeholder="Carrier Contact Name"
                value={carrierContact}
                onChange={(e) => setCarrierContact(e.target.value)}
              />

              <input
                style={input}
                placeholder="Carrier Contact Phone"
                value={carrierPhone}
                onChange={(e) => setCarrierPhone(formatPhoneHyphen(e.target.value))}
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
                placeholder="Dock PIN (optional)"
                value={dockPin}
                onChange={(e) => setDockPin(onlyDigits(e.target.value).slice(0, 6))}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={chip(mode === "auto")} onClick={() => setMode("auto")}>Auto 24h</div>
                <div style={chip(mode === "pick")} onClick={() => setMode("pick")}>Pick</div>
                <div style={chip(mode === "none")} onClick={() => setMode("none")}>No Expire</div>
              </div>

              {mode === "pick" ? (
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
              ) : null}

              <button style={buttonPrimary} onClick={issueLink} disabled={loading}>
                {loading ? "Issuing..." : "Issue AdbS Verification"}
              </button>

              {errorMsg ? (
                <div style={{ color: "#ff9c9c", fontWeight: 700 }}>{errorMsg}</div>
              ) : null}

              {statusMsg ? (
                <div style={{ color: "#ffffff" }}>{statusMsg}</div>
              ) : null}
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Issued Verification</div>

            {!issued ? (
              <div style={{ opacity: 0.74 }}>No verification selected yet.</div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Verification ID</div>
                  <input style={input} value={issued.verification_id || ""} readOnly />
                </div>

                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>AdbS SmartLink</div>
                  <input style={input} value={issued.verify_url || ""} readOnly />
                </div>

                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Status</div>
                  <input style={input} value={issued.status || ""} readOnly />
                </div>

                <div>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Expires</div>
                  <input style={input} value={formatDisplayDate(issued.expires_at)} readOnly />
                </div>

                {(issued.carrier_company || issued.carrier_contact_name || issued.carrier_contact_phone) ? (
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 12,
                      background: "rgba(255,255,255,0.04)"
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 8 }}>Carrier Contact</div>
                    <div style={{ marginBottom: 6 }}>
                      Carrier Company: <b>{issued.carrier_company || "(not provided)"}</b>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      Carrier Contact Name: <b>{issued.carrier_contact_name || "(not provided)"}</b>
                    </div>
                    <div>
                      Carrier Contact Phone: <b>{issued.carrier_contact_phone || "(not provided)"}</b>
                    </div>
                  </div>
                ) : null}

                {issued.email_status ? (
                  <div
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 12,
                      background: "rgba(255,255,255,0.04)"
                    }}
                  >
                    <div>Email Status: <b>{issued.email_status}</b></div>
                    {issued.email_error ? (
                      <div style={{ marginTop: 6, color: "#ff9c9c" }}>
                        Email Error: <b>{issued.email_error}</b>
                      </div>
                    ) : null}
                    {issued.email_debug ? (
                      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.84 }}>
                        Email Debug:
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            marginTop: 6,
                            background: "rgba(0,0,0,0.18)",
                            padding: 10,
                            borderRadius: 10
                          }}
                        >
{JSON.stringify(issued.email_debug, null, 2)}
                        </pre>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div style={{ textAlign: "center", marginTop: 4 }}>
                  {issuedQr ? (
                    <img
                      src={issuedQr}
                      alt="QR"
                      style={{
                        width: 240,
                        background: "#ffffff",
                        padding: 10,
                        borderRadius: 12
                      }}
                    />
                  ) : null}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button
                    style={buttonSoft}
                    onClick={async () => {
                      const ok = await safeCopy(issued.verify_url || "");
                      setStatusMsg(ok ? "AdbS SmartLink copied." : "Copy failed.");
                    }}
                  >
                    Copy AdbS SmartLink
                  </button>

                  <button
                    style={buttonSoft}
                    onClick={async () => {
                      const ok = await safeCopy(issued.verification_id || "");
                      setStatusMsg(ok ? "Verification ID copied." : "Copy failed.");
                    }}
                  >
                    Copy Verification ID
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {attempts.length ? (
          <div style={{ ...card, marginTop: 16 }}>
            <div style={sectionTitle}>Load Activity</div>

            <div style={{ display: "grid", gap: 10 }}>
              {attempts.map((a, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    padding: 12,
                    background: "rgba(255,255,255,0.04)"
                  }}
                >
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>
                    {String(a.result || "").toLowerCase().includes("clear") ? "CLEAR" : "ATTEMPT"}
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                    DOT: <b>{a.entered_usdot || "(blank)"}</b>
                    <br />
                    Plate: <b>{a.entered_plate || "(blank)"}</b>
                    <br />
                    Driver Answered: <b>{String(a.driver_answered ?? "")}</b>
                    <br />
                    Result: <b>{a.result || "(unknown)"}</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
