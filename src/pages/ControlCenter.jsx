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
    // Fallback for older/locked clipboard contexts
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
  // (No offense. Just… this is a paid room.)
  if (!authorized) {
    nav("/login", { replace: true });
    return null;
  }

  // Form state (keep local — helps performance)
  const [usdotOnRecord, setUsdotOnRecord] = useState("");
  const [plateOnRecord, setPlateOnRecord] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [startsAt, setStartsAt] = useState(() => nowLocalDatetime());
  const [expiresAt, setExpiresAt] = useState(() => plusHoursLocalDatetime(24));

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [issued, setIssued] = useState(null); // { token, verify_url, expires_at, ... }

  const abortRef = useRef(null);

  const normalized = useMemo(() => {
    const usdot_digits = onlyDigits(usdotOnRecord);
    const plate_upper = toUpperClean(plateOnRecord);
    const phone_digits = onlyDigits(driverPhone);
    return { usdot_digits, plate_upper, phone_digits };
  }, [usdotOnRecord, plateOnRecord, driverPhone]);

  function logout() {
    try {
      localStorage.removeItem(LS_EMAIL);
      // Optional common keys (don’t rely on exports that might not exist)
      localStorage.removeItem("qc_access_code");
      localStorage.removeItem("qc_role");
      localStorage.removeItem("access_code");
      localStorage.removeItem("role");
    } catch {}
    nav("/login", { replace: true });
  }

  async function issueLink() {
    setErrorMsg("");
    setStatusMsg("");
    setIssued(null);

    const usdot_digits = normalized.usdot_digits;
    const plate_upper = normalized.plate_upper;
    const phone_digits = normalized.phone_digits;

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
    if (!startsAt || !expiresAt) {
      setErrorMsg("Start/Expire times are required.");
      return;
    }

    // Cancel any previous request to avoid piling up and freezing.
    try {
      if (abortRef.current) abortRef.current.abort();
    } catch {}
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);

    try {
      const payload = {
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
        starts_at: startsAt,
        expires_at: expiresAt,
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

      // Accept a few possible shapes without breaking.
      const token =
        data.token || data.verify_token || (data.data && data.data.token) || "";
      const verify_url =
        data.verify_url ||
        data.url ||
        data.link ||
        (data.data && data.data.verify_url) ||
        "";

      const expires =
        data.expires_at || (data.data && data.data.expires_at) || expiresAt;

      setIssued({
        token,
        verify_url,
        expires_at: expires,
        usdot_on_record: usdot_digits,
        plate_on_record: plate_upper,
        driver_phone: formatPhoneHyphen(phone_digits),
      });

      setStatusMsg("Verify link issued.");
    } catch (e) {
      if (String(e?.name) === "AbortError") {
        // No need to show anything — user triggered another issue request.
      } else {
        setErrorMsg("Network error issuing link.");
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

  // BULLETPROOF INPUT INTERACTION (prevents “can’t click/type” caused by overlays)
  const dtInputStyle = {
    ...inputStyle,
    position: "relative",
    zIndex: 5,
    pointerEvents: "auto",
    WebkitUserSelect: "auto",
    userSelect: "auto",
    touchAction: "manipulation",
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

  const tinyBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "18px 16px 48px",
        }}
      >
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 16,
          }}
        >
          {/* Left: Issue Verify Link */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
              Issue Verify Link
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={labelStyle}>USDOT# on record</div>
                <input
                  style={inputStyle}
                  value={usdotOnRecord}
                  onChange={(e) => {
                    setUsdotOnRecord(toUpperClean(e.target.value));
                  }}
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

                {/* Buttons to guarantee control even if a picker misbehaves */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <button
                    type="button"
                    style={tinyBtn}
                    onClick={() => {
                      const n = nowLocalDatetime();
                      setStartsAt(n);
                      setStatusMsg("Start reset to now.");
                    }}
                  >
                    Reset Start = Now
                  </button>

                  <button
                    type="button"
                    style={tinyBtn}
                    onClick={() => {
                      const x = plusHoursLocalDatetime(24);
                      setExpiresAt(x);
                      setStatusMsg("Expire reset to +24h.");
                    }}
                  >
                    Reset Expire = +24h
                  </button>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  <input
                    style={dtInputStyle}
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    onFocus={() => setStatusMsg("")}
                  />
                  <input
                    style={dtInputStyle}
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    onFocus={() => setStatusMsg("")}
                  />
                </div>

                <div style={{ opacity: 0.7, fontSize: 12, marginTop: 6 }}>
                  Tip: click the field and type, or use the picker.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <button
                onClick={issueLink}
                style={btnStyle(true)}
                disabled={loading}
                title={loading ? "Issuing..." : "Issue Verify Link"}
              >
                {loading ? "Issuing..." : "Issue Verify Link"}
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

                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
                  Expires:{" "}
                  <span style={{ fontWeight: 800 }}>{issued.expires_at}</span>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div style={labelStyle}>Verify URL</div>
                    <input style={inputStyle} value={issued.verify_url || ""} readOnly />
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
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
                          setStatusMsg(ok ? "Token copied." : "Copy failed.");
                        }}
                      >
                        Copy Token
                      </button>
                    </div>
                  </div>

                  <div style={{ opacity: 0.75, fontSize: 12, lineHeight: 1.35 }}>
                    Note: This panel is the production-facing issuer UI. The legacy
                    /smartlink page stays blocked.
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right: Quick info (kept minimal; no heavy debug by default) */}
          <div style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
              Status
            </div>

            <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.45 }}>
              <div style={{ marginBottom: 10 }}>
                <b>Issuer UI:</b> Control Center (paid look) ✅
              </div>
              <div style={{ marginBottom: 10 }}>
                <b>Legacy routes:</b> /smartlink and /driverlink should redirect to
                /dashboard ✅
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
          QueCab AdbS — Truck-Driver verification system. Paid-subscription UI standards
          enforced.
        </div>
      </div>
    </div>
  );
}
