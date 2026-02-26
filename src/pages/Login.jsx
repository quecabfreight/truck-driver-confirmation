// /src/pages/Login.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, getAuthEmail, isBrokerOrShipper } from "../utils/auth.js";

const LS_CODE = "qc_access_code";
const SS_CODE = "qc_access_code_ss";

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  return s.includes("@") && s.includes(".");
}

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  // Prefill ONCE. No polling. No “tick”. No input-wiping.
  const [email, setEmail] = useState(() => {
    const e = (getAuthEmail() || "").trim();
    return e;
  });

  const [code, setCode] = useState(() => {
    try {
      return (localStorage.getItem(LS_CODE) || "").trim();
    } catch {
      return "";
    }
  });

  const [remember, setRemember] = useState(() => {
    try {
      return !!(localStorage.getItem(LS_CODE) || "").trim();
    } catch {
      return false;
    }
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const emailRef = useRef(null);
  const codeRef = useRef(null);

  // If already authorized, bounce to Control Center
  useEffect(() => {
    const e = (getAuthEmail() || "").trim();
    if (e && isBrokerOrShipper(e)) {
      nav("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cross-tab sync ONLY (doesn't fight typing)
  useEffect(() => {
    const onStorage = () => {
      const stored = (getAuthEmail() || "").trim();
      // Only update the field if user hasn’t started typing something different.
      setEmail((prev) => {
        const p = String(prev || "").trim();
        if (p && p !== stored) return prev;
        return stored;
      });

      try {
        const saved = (localStorage.getItem(LS_CODE) || "").trim();
        if (saved) {
          setCode((prev) => (prev ? prev : saved));
          setRemember(true);
        }
      } catch {}
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const canSubmit = useMemo(() => {
    return looksLikeEmail(email) && String(code || "").trim().length >= 4 && !busy;
  }, [email, code, busy]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const e1 = String(email || "").trim();
    const c1 = String(code || "").trim();

    if (!looksLikeEmail(e1)) {
      setError("Enter a valid business email.");
      emailRef.current?.focus?.();
      return;
    }
    if (c1.length < 4) {
      setError("Enter your access code.");
      codeRef.current?.focus?.();
      return;
    }

    setBusy(true);

    try {
      // Save “remember device”
      try {
        if (remember) {
          localStorage.setItem(LS_CODE, c1);
          sessionStorage.removeItem(SS_CODE);
        } else {
          localStorage.removeItem(LS_CODE);
          sessionStorage.setItem(SS_CODE, c1);
        }
      } catch {}

      // Store email for auth gating
      try {
        localStorage.setItem(LS_EMAIL, e1);
      } catch {}

      // IMPORTANT:
      // We do NOT attempt to “verify” here because your project already does that
      // in your auth flow / broker-shipper check. We just persist the login inputs
      // and navigate.
      //
      // If user is not authorized, RequireAuth will bounce them back to /login.
      nav("/dashboard", { replace: true, state: { from: loc.pathname } });
    } finally {
      setBusy(false);
    }
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 720, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0 };
  const sub = { marginTop: 8, opacity: 0.85, lineHeight: 1.5, fontSize: 14 };

  const label = { fontSize: 13, fontWeight: 900, opacity: 0.9, marginBottom: 6 };
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

  const row = { display: "grid", gap: 10, marginTop: 14 };
  const btn = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(140,190,255,0.42)",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: canSubmit ? "pointer" : "not-allowed",
    opacity: canSubmit ? 1 : 0.6,
  };

  const chkRow = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    opacity: 0.9,
    fontSize: 14,
  };

  return (
    <div style={page}>
      <Header />
      <div style={wrap}>
        <div style={card}>
          <h1 style={h1}>Log In</h1>
          <div style={sub}>
            Enter your business email and access code to reach the Control Center.
          </div>

          <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
            <div style={row}>
              <div>
                <div style={label}>Business Email</div>
                <input
                  ref={emailRef}
                  style={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@company.com"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <div style={label}>Access Code</div>
                <input
                  ref={codeRef}
                  style={input}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="QC-XXXXXX"
                  autoComplete="one-time-code"
                />
              </div>

              <label style={chkRow}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember this device
              </label>

              {error ? (
                <div
                  style={{
                    border: "1px solid rgba(255,80,80,0.35)",
                    background: "rgba(255,80,80,0.08)",
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  <b>Error:</b> {error}
                </div>
              ) : null}

              <button type="submit" style={btn} disabled={!canSubmit}>
                {busy ? "Signing in..." : "Log In"}
              </button>

              <div style={{ opacity: 0.65, fontSize: 12, lineHeight: 1.4 }}>
                Note: “Remember this device” stores your access code on this device only.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
