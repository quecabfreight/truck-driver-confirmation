// /src/pages/ControlCenter.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper, clearAuth } from "../utils/auth.js";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}
function toUpperClean(s) {
  return String(s || "").toUpperCase();
}

// Formats as 123-456-7890 while typing
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

function pad2(n) {
  return String(n).padStart(2, "0");
}

// datetime-local expects "YYYY-MM-DDTHH:mm"
function toLocalDatetimeValue(d) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mi = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
function nowLocalDatetime() {
  return toLocalDatetimeValue(new Date());
}
function plusHoursLocalDatetime(hours) {
  return toLocalDatetimeValue(new Date(Date.now() + hours * 60 * 60 * 1000));
}

export default function ControlCenter() {
  const nav = useNavigate();

  // Auth (do NOT redirect inside render — that’s how you get “nothing works” weirdness)
  const [email, setEmail] = useState(() => (localStorage.getItem(LS_EMAIL) || "").trim());
  const authorized = useMemo(() => !!email && isBrokerOrShipper(email), [email]);

  useEffect(() => {
    if (!authorized) nav("/login", { replace: true });
  }, [authorized, nav]);

  useEffect(() => {
    const onStorage = () => {
      const e = (localStorage.getItem(LS_EMAIL) || "").trim();
      setEmail(e);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Form state
  const [loadId, setLoadId] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");

  // Start/Expire mode: auto | pick | none
  const [timeMode, setTimeMode] = useState("auto");
  const [startsAt, setStartsAt] = useState(() => nowLocalDatetime());
  const [expiresAt, setExpiresAt] = useState(() => plusHoursLocalDatetime(24));

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [issued, setIssued] = useState(null); // { token, verify_url, expires_at, load_id }

  const abortRef = useRef(null);

  const normalized = useMemo(() => {
    const usdot_digits = onlyDigits(usdotOnRecord);
    const plate_upper = toUpperClean(plateOnRecord).trim();
    const phone_digits = onlyDigits(driverPhone);
    const load_id = String(loadId || "").trim();
    return { usdot_digits, plate_upper, phone_digits, load_id };
  }, [usdotOnRecord, plateOnRecord, driverPhone, loadId]);

  function logout() {
    try {
      clearAuth();
    } catch {
      try {
        localStorage.removeItem(LS_EMAIL);
      } catch {}
    }
    nav("/login", { replace: true });
  }

  function resetStartNow() {
    setStartsAt(nowLocalDatetime());
    setStatusMsg("Start reset to now.");
    setErrorMsg("");
  }

  function resetExpire24h() {
    setExpiresAt(plusHoursLocalDatetime(24));
    setStatusMsg("Expire reset to +24h.");
    setErrorMsg("");
  }

  useEffect(() => {
    // Keep “auto” mode sane: if user switches to auto, snap times to now/+24h once.
    if (timeMode === "auto") {
      setStartsAt(nowLocalDatetime());
      setExpiresAt(plusHoursLocalDatetime(24));
    }
  }, [timeMode]);

  async function issueAdbsVerification() {
    setErrorMsg("");
    setStatusMsg("");
    setIssued(null);

    const { usdot_digits, plate_upper, phone_digits, load_id } = normalized;

    if (!load_id) {
      setErrorMsg("Enter Load ID (simple identifier).");
      return;
    }
    if (!phone_digits || phone_digits.length !== 10) {
      setErrorMsg("Enter Driver Phone (10 digits).");
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

    // Compute times based on mode
    const payload = {
      load_id,
      usdot_on_record: usdot_digits,
      plate_on_record: plate_upper,
      driver_phone: formatPhoneHyphen(phone_digits),
      starts_at: null,
      expires_at: null,
    };

    if (timeMode === "auto") {
      payload.starts_at = nowLocalDatetime();
      payload.expires_at = plusHoursLocalDatetime(24);
    } else if (timeMode === "pick") {
      if (!startsAt) {
        setErrorMsg("Pick mode: Start time is required.");
        return;
      }
      if (!expiresAt) {
        setErrorMsg("Pick mode: Expire time is required.");
        return;
      }
      payload.starts_at = startsAt;
      payload.expires_at = expiresAt;
    } else if (timeMode === "none") {
      // No Expire: starts now; expires null
      payload.starts_at = nowLocalDatetime();
      payload.expires_at = null;
    }

    // Cancel any previous in-flight request
    try {
      if (abortRef.current) abortRef.current.abort();
    } catch {}
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
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
        const msg = (data && (data.error || data.message)) || `Issuer failed (${res.status}).`;
        setErrorMsg(msg);
        return;
      }

      const token =
        data.token || data.verify_token || (data.data && data.data.token) || "";
      const verify_url =
        data.verify_url || data.url || data.link || (data.data && data.data.verify_url) || "";

      const expires =
        data.expires_at || (data.data && data.data.expires_at) || payload.expires_at;

      setIssued({
        token,
        verify_url,
        expires_at: expires,
        load_id,
      });

      setStatusMsg("AdbS verification link issued.");
    } catch (e) {
      if (String(e?.name) !== "AbortError") {
        setErrorMsg("Network error issuing link.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Styles
  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const labelStyle = { fontSize: 14, opacity: 0.92, marginBottom: 6 };
  const helpStyle = { opacity: 0.7, fontSize: 12, marginTop: 6, lineHeight: 1.3 };

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
    fontWeight: 900,
    cursor: "pointer",
  });

  const modeBtn = (active) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: active ? "1px solid rgba(120,180,255,0.55)" : "1px solid rgba(255,255,255,0.16)",
    background: active ? "rgba(40,110,190,0.20)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 14,
    fontWeight: 950,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  if (!authorized) return null;

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
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 0.2 }}>
              Control Center
            </div>
            <div style={{ opacity: 0.85, marginTop: 6, fontSize: 15 }}>
              Authorized: <span style={{ fontWeight: 800 }}>{email}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, minWidth: 220 }}>
            <button onClick={logout} style={btnStyle(false)}>
              Log Out
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 16 }}>
          {/* LEFT: Issuer */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
              Issue AdbS Verification
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={labelStyle}>Load ID</div>
                <input
                  style={inputStyle}
                  value={loadId}
                  onChange={(e) => setLoadId(String(e.target.value || ""))}
                  placeholder="12345"
                  autoComplete="off"
                />
                <div style={helpStyle}>
                  Simple identifier so checks tie to the correct load.
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
                <div style={helpStyle}>Auto-formats 123-456-7890.</div>
              </div>

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
                <div style={helpStyle}>Compared digits-only.</div>
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
                <div style={helpStyle}>Auto-uppercase while typing.</div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div style={labelStyle}>Start / Expire</div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                  <button
                    type="button"
                    style={modeBtn(timeMode === "auto")}
                    onClick={() => setTimeMode("auto")}
                  >
                    Auto 24h Expire
                  </button>
                  <button
                    type="button"
                    style={modeBtn(timeMode === "pick")}
                    onClick={() => setTimeMode("pick")}
                  >
                    Pick Start/Expire
                  </button>
                  <button
                    type="button"
                    style={modeBtn(timeMode === "none")}
                    onClick={() => setTimeMode("none")}
                  >
                    No Expire
                  </button>

                  <div style={{ flex: 1 }} />

                  <button type="button" style={modeBtn(false)} onClick={resetStartNow}>
                    Reset Start = Now
                  </button>
                  <button type="button" style={modeBtn(false)} onClick={resetExpire24h}>
                    Reset Expire = +24h
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    style={{ ...inputStyle, opacity: timeMode === "none" ? 0.55 : 1 }}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    disabled={timeMode === "auto"}
                  />
                  <input
                    style={{ ...inputStyle, opacity: timeMode === "none" ? 0.55 : 1 }}
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    disabled={timeMode !== "pick"}
                  />
                </div>

                <div style={helpStyle}>
                  Auto mode uses Now → +24h. Pick mode lets you edit. No Expire sends expires_at as null.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <button
                onClick={issueAdbsVerification}
                style={btnStyle(true)}
                disabled={loading}
                title={loading ? "Issuing..." : "Issue AdbS Verification"}
              >
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
                  <b>Error:</b> {errorMsg}
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
                <div style={{ fontSize: 16, fontWeight: 950, marginBottom: 8 }}>
                  Issued
                </div>

                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
                  Load ID: <span style={{ fontWeight: 950 }}>{issued.load_id}</span>
                  <br />
                  Expires:{" "}
                  <span style={{ fontWeight: 950 }}>
                    {issued.expires_at === null ? "No Expire" : String(issued.expires_at || "")}
                  </span>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={labelStyle}>Verify URL</div>
                    <input style={inputStyle} value={issued.verify_url || ""} readOnly />
                    <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                      <button
                        style={{ ...btnStyle(false), width: "auto", minWidth: 160 }}
                        onClick={async () => {
                          const ok = await safeCopy(issued.verify_url || "");
                          setStatusMsg(ok ? "Link copied." : "Copy failed.");
                        }}
                      >
                        Copy Link
                      </button>

                      <button
                        style={{ ...btnStyle(false), width: "auto", minWidth: 200 }}
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
                    Note: This panel is the production-facing issuer UI. The legacy /smartlink page stays blocked.
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* RIGHT: Status */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>
              Status
            </div>

            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.45 }}>
              <div style={{ marginBottom: 10 }}>
                <b>Issuer UI:</b> Control Center (paid look) ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Legacy routes:</b> /smartlink and /driverlink redirect ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Formatting:</b> Phone auto-hyphenates; USDOT/Plate uppercase ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Verify links:</b> Public (no login required) ✅
              </div>
              <div style={{ opacity: 0.75 }}>
                Next: CAUTION ALERT polish (flash + sound) + silent issuer alerts.
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
