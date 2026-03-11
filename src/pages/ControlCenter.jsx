// /src/pages/ControlCenter.jsx
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

export default function ControlCenter() {
  const nav = useNavigate();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  const loadIdRef = useRef(null);
  const dockEmailRef = useRef(null);
  const dockPinRef = useRef(null);
  const driverPhoneRef = useRef(null);
  const usdotRef = useRef(null);
  const plateRef = useRef(null);
  const abortRef = useRef(null);

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

  if (!authorized) {
    return null;
  }

  const [loadId, setLoadId] = useState("");
  const [dockEmail, setDockEmail] = useState("");
  const [dockPin, setDockPin] = useState("");
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [carrierCompany, setCarrierCompany] = useState("");
  const [dispatchContact, setDispatchContact] = useState("");
  const [dispatchPhone, setDispatchPhone] = useState("");

  const [mode, setMode] = useState("auto");
  const [startsAt, setStartsAt] = useState(() => nowLocalDatetime());
  const [expiresAt, setExpiresAt] = useState(() => plusHoursLocalDatetime(24));

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [issued, setIssued] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");

  const normalized = useMemo(() => {
    return {
      usdot_digits: onlyDigits(usdotOnRecord),
      plate_upper: toUpperClean(plateOnRecord).trim(),
      phone_digits: onlyDigits(driverPhone),
      dock_pin_digits: onlyDigits(dockPin).slice(0, 6),
      dispatch_phone_digits: onlyDigits(dispatchPhone).slice(0, 10),
    };
  }, [usdotOnRecord, plateOnRecord, driverPhone, dockPin, dispatchPhone]);

  function logout() {
    try {
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem("qc_access_code");
      localStorage.removeItem("qc_role");
      localStorage.removeItem("access_code");
      localStorage.removeItem("role");
    } catch {}
    nav("/login", { replace: true });
  }

  async function safeJson(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  function clearNextLoadFields() {
    setLoadId("");
    setDriverPhone("");
    setUsdotOnRecord("");
    setPlateOnRecord("");
    setCarrierCompany("");
    setDispatchContact("");
    setDispatchPhone("");

    setTimeout(() => {
      loadIdRef.current?.focus();
      loadIdRef.current?.select?.();
    }, 0);
  }

  function handleFormKeyDown(e) {
    if (e.key !== "Enter") return;
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) return;

    const tag = String(e.target?.tagName || "").toLowerCase();
    if (tag === "textarea") return;

    e.preventDefault();

    if (loading) return;

    const grid = e.currentTarget;
    const fields = Array.from(
      grid.querySelectorAll('input:not([disabled]), textarea:not([disabled]), select:not([disabled])')
    ).filter((el) => el.offsetParent !== null);

    const idx = fields.indexOf(e.target);

    if (idx >= 0 && idx < fields.length - 1) {
      const next = fields[idx + 1];
      next?.focus?.();
      next?.select?.();
      return;
    }

    issueLink();
  }

  async function issueLink() {
    setErrorMsg("");
    setStatusMsg("");
    setAttempts([]);

    const usdot_digits = normalized.usdot_digits;
    const plate_upper = normalized.plate_upper;
    const phone_digits = normalized.phone_digits;

    if (!usdot_digits) {
      setErrorMsg("Enter USDOT# (digits).");
      usdotRef.current?.focus();
      return;
    }
    if (!plate_upper) {
      setErrorMsg("Enter Plate.");
      plateRef.current?.focus();
      return;
    }
    if (phone_digits.length !== 10) {
      setErrorMsg("Enter Driver Phone (10 digits).");
      driverPhoneRef.current?.focus();
      return;
    }

    const pin = normalized.dock_pin_digits;
    if (pin && (pin.length < 4 || pin.length > 6)) {
      setErrorMsg("Dock PIN must be 4–6 digits (or leave blank).");
      dockPinRef.current?.focus();
      return;
    }

    const dispatchPhoneFormatted = normalized.dispatch_phone_digits
      ? formatPhoneHyphen(normalized.dispatch_phone_digits)
      : "";

    let starts_at = null;
    let expires_at = null;

    if (mode === "auto") {
      starts_at = nowLocalDatetime();
      expires_at = plusHoursLocalDatetime(24);
      setStartsAt(starts_at);
      setExpiresAt(expires_at);
    } else if (mode === "pick") {
      if (!startsAt || !expiresAt) {
        setErrorMsg("Start/Expire times are required.");
        return;
      }
      starts_at = startsAt;
      expires_at = expiresAt;
    } else {
      starts_at = nowLocalDatetime();
      expires_at = null;
      setStartsAt(starts_at);
      setExpiresAt(plusHoursLocalDatetime(24));
    }

    try {
      if (abortRef.current) abortRef.current.abort();
    } catch {}
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);

    try {
      const payload = {
        load_id: String(loadId || "").trim() || null,
        dock_email: String(dockEmail || "").trim() || null,
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
        starts_at,
        expires_at,
        dock_pin: pin || null,

        carrier_company: String(carrierCompany || "").trim() || null,
        dispatch_contact: String(dispatchContact || "").trim() || null,
        dispatch_phone: dispatchPhoneFormatted || null,
      };

      const res = await fetch("/api/issue_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data?.error || data?.message || `Issuer failed (${res.status}).`);
        setLoading(false);
        return;
      }

      const msgLines = [
        "AdbS TRUCK-DRIVER VERIFICATION",
        "",
        payload.load_id ? `Load ID: ${payload.load_id}` : null,
        payload.carrier_company ? `Carrier Company: ${payload.carrier_company}` : null,
        payload.dispatch_contact ? `Dispatch Contact: ${payload.dispatch_contact}` : null,
        payload.dispatch_phone ? `Dispatch Phone: ${payload.dispatch_phone}` : null,
        "",
        "OPEN AT DOCK:",
        data?.verify_url || "",
        "",
        "Dock Instruction:",
        "When the truck arrives, open the link above and complete verification before releasing the load.",
        "Enter the DOT and plate shown on the truck, then call the driver using the link.",
        "",
        `Expires: ${data?.expires_at ? String(data.expires_at) : "No Expire"}`,
      ]
        .filter(Boolean)
        .join("\n");

      setIssued({
        token: data?.token || "",
        verify_url: data?.verify_url || "",
        expires_at: data?.expires_at || null,
        load_id: payload.load_id,
        dock_email: payload.dock_email,
        email_status: data?.email_status || null,
        email_error: data?.email_error || null,
        full_message: msgLines,
        status: data?.status || "active",

        carrier_company: payload.carrier_company,
        dispatch_contact: payload.dispatch_contact,
        dispatch_phone: payload.dispatch_phone,
      });

      if (payload.dock_email && data?.email_status === "sent") {
        setStatusMsg("AdbS Verification issued and emailed to dock.");
      } else if (payload.dock_email && data?.email_status === "failed") {
        setStatusMsg("AdbS Verification issued, but dock email failed.");
      } else {
        setStatusMsg("AdbS Verification issued.");
      }

      clearNextLoadFields();
    } catch (e) {
      if (String(e?.name) !== "AbortError") {
        setErrorMsg("Network error issuing link.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLever(action) {
    if (!issued?.token) return;

    setActionLoading(action);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          token: issued.token,
          dock_email: issued.dock_email || null,
        }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data?.error || data?.message || `${action} failed.`);
        return;
      }

      if (action === "reissue") {
        const newToken = data?.new_token || "";
        const newUrl = data?.verify_url || "";
        const newMessage = [
          "AdbS TRUCK-DRIVER VERIFICATION",
          "",
          issued.load_id ? `Load ID: ${issued.load_id}` : null,
          issued.carrier_company ? `Carrier Company: ${issued.carrier_company}` : null,
          issued.dispatch_contact ? `Dispatch Contact: ${issued.dispatch_contact}` : null,
          issued.dispatch_phone ? `Dispatch Phone: ${issued.dispatch_phone}` : null,
          "",
          "OPEN AT DOCK:",
          newUrl,
          "",
          "Dock Instruction:",
          "When the truck arrives, open the link above and complete verification before releasing the load.",
          "Enter the DOT and plate shown on the truck, then call the driver using the link.",
          "",
          `Expires: ${issued.expires_at ? String(issued.expires_at) : "No Expire"}`,
        ]
          .filter(Boolean)
          .join("\n");

        setIssued((prev) => ({
          ...prev,
          token: newToken,
          verify_url: newUrl,
          full_message: newMessage,
          email_status: data?.email_status || prev?.email_status || null,
          email_error: data?.email_error || null,
          status: "active",
        }));

        setStatusMsg(
          data?.email_status === "sent"
            ? "Verification link reissued and emailed."
            : "Verification link reissued."
        );
        return;
      }

      if (action === "lock") {
        setIssued((prev) => ({ ...prev, status: "locked" }));
        setStatusMsg("Load verification locked.");
        return;
      }

      if (action === "clear") {
        setIssued((prev) => ({ ...prev, status: "cleared" }));
        setStatusMsg("Load marked cleared.");
        return;
      }
    } catch {
      setErrorMsg(`${action} failed due to network error.`);
    } finally {
      setActionLoading("");
    }
  }

  async function loadAttempts() {
    if (!issued?.token) return;

    setAttemptsLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch("/api/manage_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "attempts",
          token: issued.token,
        }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        setErrorMsg(data?.error || data?.message || "Failed to load attempts.");
        return;
      }

      setAttempts(Array.isArray(data?.attempts) ? data.attempts : []);
      setStatusMsg("Load activity loaded.");
    } catch {
      setErrorMsg("Failed to load attempts.");
    } finally {
      setAttemptsLoading(false);
    }
  }

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const labelStyle = { fontSize: 14, opacity: 0.92, marginBottom: 6, fontWeight: 800 };

  const inputStyle = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 16,
    outline: "none",
  };

  const btnStyle = (primary) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: primary ? "1px solid rgba(120,180,255,0.45)" : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 900,
  });

  const chip = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? "1px solid rgba(90,200,140,0.45)" : "1px solid rgba(255,255,255,0.16)",
    background: active ? "rgba(90,200,140,0.14)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    cursor: "pointer",
    fontWeight: 900,
    textAlign: "center",
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 0.2 }}>Control Center</div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 15 }}>
              Authorized: <span style={{ fontWeight: 700 }}>{email}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={logout} style={btnStyle(false)}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 16 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Issue AdbS Verification</div>

            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
              onKeyDown={handleFormKeyDown}
            >
              <div>
                <div style={labelStyle}>Load ID</div>
                <input
                  ref={loadIdRef}
                  style={inputStyle}
                  value={loadId}
                  onChange={(e) => setLoadId(e.target.value)}
                  placeholder="Rob Q1"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Dock Email</div>
                <input
                  ref={dockEmailRef}
                  style={inputStyle}
                  value={dockEmail}
                  onChange={(e) => setDockEmail(e.target.value)}
                  placeholder="dock@warehouse.com"
                  inputMode="email"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Dock PIN (optional)</div>
                <input
                  ref={dockPinRef}
                  style={inputStyle}
                  value={dockPin}
                  onChange={(e) => setDockPin(onlyDigits(e.target.value).slice(0, 6))}
                  placeholder="4–6 digits (optional)"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Driver Phone</div>
                <input
                  ref={driverPhoneRef}
                  style={inputStyle}
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(formatPhoneHyphen(e.target.value))}
                  placeholder="123-456-7890"
                  inputMode="tel"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>USDOT# on record</div>
                <input
                  ref={usdotRef}
                  style={inputStyle}
                  value={usdotOnRecord}
                  onChange={(e) => setUsdotOnRecord(onlyDigits(e.target.value))}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Plate on record</div>
                <input
                  ref={plateRef}
                  style={inputStyle}
                  value={plateOnRecord}
                  onChange={(e) => setPlateOnRecord(toUpperClean(e.target.value))}
                  placeholder="ABC1234"
                  inputMode="text"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Carrier Company (optional)</div>
                <input
                  style={inputStyle}
                  value={carrierCompany}
                  onChange={(e) => setCarrierCompany(e.target.value)}
                  placeholder="ABC Logistics LLC"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Dispatch Contact (optional)</div>
                <input
                  style={inputStyle}
                  value={dispatchContact}
                  onChange={(e) => setDispatchContact(e.target.value)}
                  placeholder="Mike Reynolds"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Dispatch Phone (optional)</div>
                <input
                  style={inputStyle}
                  value={dispatchPhone}
                  onChange={(e) => setDispatchPhone(formatPhoneHyphen(e.target.value))}
                  placeholder="123-456-7890"
                  inputMode="tel"
                  autoComplete="off"
                />
              </div>

              <div>
                <div style={labelStyle}>Start / Expire</div>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <div style={chip(mode === "auto")} onClick={() => setMode("auto")}>Auto 24h</div>
                    <div style={chip(mode === "pick")} onClick={() => setMode("pick")}>Pick</div>
                    <div style={chip(mode === "none")} onClick={() => setMode("none")}>No Expire</div>
                  </div>

                  <input
                    style={inputStyle}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    disabled={mode !== "pick"}
                  />
                  <input
                    style={inputStyle}
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    disabled={mode !== "pick"}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <button onClick={issueLink} style={btnStyle(true)} disabled={loading}>
                {loading ? "Issuing..." : "Issue AdbS Verification"}
              </button>

              {errorMsg ? (
                <div style={{ border: "1px solid rgba(255,80,80,0.35)", background: "rgba(255,80,80,0.08)", padding: 12, borderRadius: 12, fontSize: 14 }}>
                  <b>Error:</b> {errorMsg}
                </div>
              ) : null}

              {statusMsg ? (
                <div style={{ border: "1px solid rgba(120,180,255,0.30)", background: "rgba(120,180,255,0.08)", padding: 12, borderRadius: 12, fontSize: 14 }}>
                  {statusMsg}
                </div>
              ) : null}
            </div>

            {issued ? (
              <div style={{ marginTop: 14, ...cardStyle, padding: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>Issued</div>

                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
                  Load ID: <span style={{ fontWeight: 900 }}>{issued.load_id || "(none)"}</span>
                  <br />
                  Status: <span style={{ fontWeight: 900 }}>{issued.status || "active"}</span>
                  <br />
                  Expires: <span style={{ fontWeight: 900 }}>{issued.expires_at ? String(issued.expires_at) : "No Expire"}</span>
                  <br />
                  Dock Email: <span style={{ fontWeight: 900 }}>{issued.dock_email || "(manual only)"}</span>
                  <br />
                  Email Status: <span style={{ fontWeight: 900 }}>{issued.email_status || "not sent"}</span>
                </div>

                {(issued.carrier_company || issued.dispatch_contact || issued.dispatch_phone) ? (
                  <div
                    style={{
                      marginBottom: 12,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      padding: 12,
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>Carrier Contact</div>

                    {issued.carrier_company ? (
                      <div style={{ fontSize: 14, marginBottom: 6 }}>
                        Carrier Company: <span style={{ fontWeight: 900 }}>{issued.carrier_company}</span>
                      </div>
                    ) : null}

                    {issued.dispatch_contact ? (
                      <div style={{ fontSize: 14, marginBottom: 6 }}>
                        Dispatch Contact: <span style={{ fontWeight: 900 }}>{issued.dispatch_contact}</span>
                      </div>
                    ) : null}

                    {issued.dispatch_phone ? (
                      <div style={{ fontSize: 14 }}>
                        Dispatch Phone:{" "}
                        <a
                          href={`tel:${onlyDigits(issued.dispatch_phone)}`}
                          style={{
                            color: "#e6edf5",
                            fontWeight: 900,
                            textDecoration: "none",
                          }}
                          title="Call Dispatch"
                        >
                          {issued.dispatch_phone}
                        </a>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {issued.email_error ? (
                  <div style={{ marginBottom: 10, border: "1px solid rgba(255,80,80,0.35)", background: "rgba(255,80,80,0.08)", padding: 10, borderRadius: 10, fontSize: 13 }}>
                    <b>Email Error:</b> {issued.email_error}
                  </div>
                ) : null}

                <div>
                  <div style={labelStyle}>Verify URL</div>
                  <input style={inputStyle} value={issued.verify_url || ""} readOnly />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
                    <button
                      style={btnStyle(false)}
                      onClick={async () => {
                        const ok = await safeCopy(issued.verify_url || "");
                        setStatusMsg(ok ? "Link copied." : "Copy failed.");
                      }}
                    >
                      Copy AdbS ID Link
                    </button>

                    <button
                      style={btnStyle(false)}
                      onClick={async () => {
                        const ok = await safeCopy(issued.full_message || "");
                        setStatusMsg(ok ? "Full message copied." : "Copy failed.");
                      }}
                    >
                      Copy Full Message
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                    <button
                      style={btnStyle(false)}
                      disabled={actionLoading === "reissue"}
                      onClick={() => handleLever("reissue")}
                    >
                      {actionLoading === "reissue" ? "Reissuing..." : "Reissue Verification Link"}
                    </button>

                    <button
                      style={btnStyle(false)}
                      disabled={actionLoading === "lock"}
                      onClick={() => handleLever("lock")}
                    >
                      {actionLoading === "lock" ? "Locking..." : "Lock Load Verification"}
                    </button>

                    <button
                      style={btnStyle(false)}
                      disabled={actionLoading === "clear"}
                      onClick={() => handleLever("clear")}
                    >
                      {actionLoading === "clear" ? "Marking..." : "Mark Load Cleared"}
                    </button>

                    <button
                      style={btnStyle(false)}
                      disabled={attemptsLoading}
                      onClick={loadAttempts}
                    >
                      {attemptsLoading ? "Loading..." : "Review Attempts"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Load Activity</div>

            {!attempts.length ? (
              <div style={{ opacity: 0.75, fontSize: 14 }}>
                No verification attempts recorded yet.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {attempts.map((a, idx) => (
                  <div
                    key={`${a.id || idx}-${idx}`}
                    style={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      padding: 12,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <div style={{ fontWeight: 900, marginBottom: 6 }}>
                      {String(a.result || "").toLowerCase().includes("clear") ? "CLEAR" : "ATTEMPT"}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.45 }}>
                      DOT Entered: <b>{a.entered_usdot || "(blank)"}</b>
                      <br />
                      Plate Entered: <b>{a.entered_plate || "(blank)"}</b>
                      <br />
                      Driver Answered: <b>{String(a.driver_answered ?? "").toUpperCase()}</b>
                      <br />
                      Result: <b>{a.result || "(unknown)"}</b>
                      <br />
                      Time: <b>{a.created_at || a.checked_at || "(unknown)"}</b>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 16, opacity: 0.65, fontSize: 12 }}>
          QueCab AdbS — Truck-Driver verification system. Developed by Omnimobile Inc. for QueCab Inc.
        </div>
      </div>
    </div>
  );
}
