// /src/pages/ControlCenter.jsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function toUpperClean(s) {
  return String(s || "").toUpperCase();
}

// Formats as 123-456-7890 while typing (digits only under the hood)
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
  // datetime-local expects "YYYY-MM-DDTHH:mm"
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

function plusHoursLocalDatetime(hours) {
  const d = new Date(Date.now() + hours * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function ControlCenter() {
  const nav = useNavigate();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  // If someone hits this page without auth, bounce them.
  if (!authorized) {
    nav("/login", { replace: true });
    return null;
  }

  // Core form fields
  const [loadId, setLoadId] = useState("");
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  // Expire modes
  // auto24  => starts now, expires +24h (editable via reset buttons)
  // custom  => user sets both fields
  // noexpire => starts now, expires_at = null
  const [expireMode, setExpireMode] = useState("auto24");
  const [startsAt, setStartsAt] = useState(() => nowLocalDatetime());
  const [expiresAt, setExpiresAt] = useState(() => plusHoursLocalDatetime(24));

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [issued, setIssued] = useState(null); // { token, verify_url, expires_at, ... }

  const abortRef = useRef(null);

  const normalized = useMemo(() => {
    const load_id = String(loadId || "").trim();
    const usdot_digits = onlyDigits(usdotOnRecord);
    const plate_upper = toUpperClean(plateOnRecord).trim();
    const phone_digits = onlyDigits(driverPhone);
    return { load_id, usdot_digits, plate_upper, phone_digits };
  }, [loadId, usdotOnRecord, plateOnRecord, driverPhone]);

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

  function resetStartNow() {
    setStartsAt(nowLocalDatetime());
  }

  function resetExpire24h() {
    setExpiresAt(plusHoursLocalDatetime(24));
  }

  async function issueLink() {
    setErrorMsg("");
    setStatusMsg("");
    setIssued(null);

    const { load_id, usdot_digits, plate_upper, phone_digits } = normalized;

    if (!load_id) {
      setErrorMsg("Enter Load ID.");
      return;
    }
    if (!usdot_digits) {
      setErrorMsg("Enter USDOT# (digits).");
      return;
    }
    if (!plate_upper) {
      setErrorMsg("Enter Plate.");
      return;
    }
    if (phone_digits.length !== 10) {
      setErrorMsg("Enter Driver Phone (10 digits).");
      return;
    }

    // Determine dates based on mode
    let starts_at = startsAt;
    let expires_at = expiresAt;

    if (expireMode === "auto24") {
      // Use current values (you can reset them with buttons)
      if (!starts_at) starts_at = nowLocalDatetime();
      if (!expires_at) expires_at = plusHoursLocalDatetime(24);
    } else if (expireMode === "custom") {
      if (!starts_at || !expires_at) {
        setErrorMsg("Start and Expire are required in Custom mode.");
        return;
      }
    } else if (expireMode === "noexpire") {
      // Start now; no expire
      if (!starts_at) starts_at = nowLocalDatetime();
      expires_at = null;
    }

    // Cancel any previous request to avoid piling up
    try {
      if (abortRef.current) abortRef.current.abort();
    } catch {}
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);

    try {
      const payload = {
        load_id,
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
        starts_at,
        expires_at, // null allowed for no-expire
      };

      const res = await fetch("/api/issue_verify_link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        const msg =
          (data && (data.error || data.message)) ||
          `Issuer failed (${res.status}).`;
        setErrorMsg(msg);
        setLoading(false);
        return;
      }

      const token =
        data.token || data.verify_token || (data.data && data.data.token) || "";
      const verify_url =
        data.verify_url ||
        data.url ||
        data.link ||
        (data.data && data.data.verify_url) ||
        "";

      const expires =
        data.expires_at || (data.data && data.data.expires_at) || expires_at;

      setIssued({
        token,
        verify_url,
        expires_at: expires,
        load_id,
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
      });

      setStatusMsg("Verification issued.");
    } catch (e) {
      if (String(e?.name) === "AbortError") {
        // user triggered another request
      } else {
        setErrorMsg("Network error issuing verification.");
      }
    } finally {
      setLoading(false);
    }
  }

  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const labelStyle = { fontSize: 14, opacity: 0.92, marginBottom: 6 };

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
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    cursor: "pointer",
  });

  const smallBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const modeBtn = (active) => ({
    ...smallBtn,
    border: active
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: active ? "rgba(40, 110, 190, 0.25)" : "rgba(255,255,255,0.06)",
    fontWeight: active ? 900 : 800,
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
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 0.2 }}>
              Control Center
            </div>
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
          {/* Left: Issuer */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
              Issue AdbS Verification
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={labelStyle}>Load ID</div>
                <input
                  style={inputStyle}
                  value={loadId}
                  onChange={(e) => setLoadId(String(e.target.value || ""))}
                  placeholder="Example: LOAD-12345"
                  inputMode="text"
                  autoComplete="off"
                />
                <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                  Your internal identifier so checks always tie back to the right load.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>USDOT# on record</div>
                  <input
                    style={inputStyle}
                    value={usdotOnRecord}
                    onChange={(e) => setUsdotOnRecord(toUpperClean(e.target.value))}
                    placeholder="123456"
                    inputMode="text"
                    autoComplete="off"
                  />
                  <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                    Compared digits-only.
                  </div>
                </div>

                <div>
                  <div style={labelStyle}>Plate on record</div>
                  <input
                    style={inputStyle}
                    value={plateOnRecord}
                    onChange={(e) => setPlateOnRecord(toUpperClean(e.target.value))}
                    placeholder="ABC1234"
                    inputMode="text"
                    autoComplete="off"
                  />
                  <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                    Auto-uppercase while typing.
                  </div>
                </div>
              </div>

              <div>
                <div style={labelStyle}>Driver Phone</div>
                <input
                  style={inputStyle}
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(formatPhoneHyphen(e.target.value))}
                  placeholder="123-456-7890"
                  inputMode="tel"
                  autoComplete="off"
                />
                <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                  Auto-formats 123-456-7890.
                </div>
              </div>

              <div>
                <div style={labelStyle}>Start / Expire</div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <button
                    type="button"
                    style={modeBtn(expireMode === "auto24")}
                    onClick={() => {
                      setExpireMode("auto24");
                      setStartsAt((v) => v || nowLocalDatetime());
                      setExpiresAt((v) => v || plusHoursLocalDatetime(24));
                    }}
                  >
                    Auto 24 Hour Expire
                  </button>

                  <button
                    type="button"
                    style={modeBtn(expireMode === "custom")}
                    onClick={() => setExpireMode("custom")}
                  >
                    Custom Start/Expire
                  </button>

                  <button
                    type="button"
                    style={modeBtn(expireMode === "noexpire")}
                    onClick={() => {
                      setExpireMode("noexpire");
                      setStartsAt((v) => v || nowLocalDatetime());
                    }}
                  >
                    No Expire
                  </button>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="button" style={smallBtn} onClick={resetStartNow}>
                      Reset Start = Now
                    </button>

                    {expireMode !== "noexpire" ? (
                      <button type="button" style={smallBtn} onClick={resetExpire24h}>
                        Reset Expire = +24h
                      </button>
                    ) : null}
                  </div>

                  <input
                    style={inputStyle}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                  />

                  {expireMode !== "noexpire" ? (
                    <input
                      style={inputStyle}
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                    />
                  ) : (
                    <div style={{ opacity: 0.78, fontSize: 13, lineHeight: 1.35 }}>
                      No Expire selected — verification will remain active until you revoke it later.
                    </div>
                  )}

                  <div style={{ opacity: 0.7, fontSize: 12 }}>
                    Tip: click the field and type, or use the picker.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <button onClick={issueLink} style={btnStyle(true)} disabled={loading}>
                {loading ? "Issuing..." : "Issue AdbS Verification"}
              </button>

              {errorMsg ? (
                <div
                  style={{
                    border: "1px solid rgba(255,80,80,0.35)",
                    background: "rgba(255,80,80,0.08)",
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  <b style={{ letterSpacing: 0.2 }}>Error:</b> {errorMsg}
                </div>
              ) : null}

              {statusMsg ? (
                <div
                  style={{
                    border: "1px solid rgba(120,180,255,0.30)",
                    background: "rgba(120,180,255,0.08)",
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  {statusMsg}
                </div>
              ) : null}
            </div>

            {issued ? (
              <div style={{ marginTop: 14, ...cardStyle, padding: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>
                  Issued
                </div>

                <div style={{ fontSize: 14, opacity: 0.92, marginBottom: 10 }}>
                  Load ID: <span style={{ fontWeight: 900 }}>{issued.load_id}</span>
                </div>

                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
                  Expires:{" "}
                  <span style={{ fontWeight: 800 }}>
                    {issued.expires_at ? String(issued.expires_at) : "No Expire"}
                  </span>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={labelStyle}>Verify URL</div>
                    <input style={inputStyle} value={issued.verify_url || ""} readOnly />
                    <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                      <button
                        style={btnStyle(false)}
                        onClick={async () => {
                          const ok = await safeCopy(issued.verify_url || "");
                          setStatusMsg(ok ? "Link copied." : "Copy failed.");
                        }}
                      >
                        Copy Link
                      </button>

                      <button
                        style={btnStyle(false)}
                        onClick={async () => {
                          const ok = await safeCopy(issued.token || "");
                          setStatusMsg(ok ? "Verification ID copied." : "Copy failed.");
                        }}
                      >
                        Copy Verification ID
                      </button>
                    </div>
                  </div>

                  <div style={{ opacity: 0.75, fontSize: 12, lineHeight: 1.35 }}>
                    Note: This panel is the production-facing issuer UI. The legacy /smartlink
                    page stays blocked.
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right: Status panel (keep as-is, light weight) */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Status</div>

            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.45 }}>
              <div style={{ marginBottom: 10 }}>
                <b>Issuer UI:</b> Control Center (paid look) ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Legacy routes:</b> /smartlink and /driverlink redirect to /dashboard ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Formatting:</b> Phone auto-hyphenates; USDOT/Plate uppercase ✅
              </div>
              <div style={{ opacity: 0.75 }}>
                Next: CAUTION ALERT polish (flash + sound) after issuer is stable.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, opacity: 0.65, fontSize: 12 }}>
          QueCab AdbS — Truck-Driver verification system. Paid-subscription UI standards enforced.
        </div>
      </div>
    </div>
  );
}
