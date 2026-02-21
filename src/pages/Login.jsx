// /src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { looksLikeEmail, setAuthEmail, getAuthEmail, clearAuth } from "../utils/auth.js";

export default function Login() {
  const nav = useNavigate();

  const [businessEmail, setBusinessEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // If already logged in, go to dashboard
  useEffect(() => {
    const existing = getAuthEmail();
    if (looksLikeEmail(existing)) {
      nav("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = useMemo(() => {
    const em = String(businessEmail || "").trim().toLowerCase();
    const code = String(accessCode || "").trim();
    return looksLikeEmail(em) && code.length >= 4 && !busy;
  }, [businessEmail, accessCode, busy]);

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;

    setErr("");
    setBusy(true);

    // Normalize inputs
    const email = String(businessEmail || "").trim().toLowerCase();
    const code = String(accessCode || "").trim();

    if (!looksLikeEmail(email)) {
      setBusy(false);
      setErr("Enter a valid business email.");
      return;
    }
    if (code.length < 4) {
      setBusy(false);
      setErr("Enter your access code.");
      return;
    }

    try {
      // Clear any junk session first to prevent loops
      clearAuth();

      // STORE AUTH FIRST (this is what stops the blink loop)
      const stored = setAuthEmail(email, { remember });

      if (!looksLikeEmail(stored)) {
        throw new Error("Login could not store your email on this device.");
      }

      // OPTIONAL: if your app later validates access codes via API/Supabase,
      // that check can be re-added here. For now, we stop the UI loop and
      // let the dashboard enforce access rules.
      //
      // If you already have a server validation endpoint, tell me which file,
      // and we’ll wire it back in without changing the layout.

      nav("/dashboard", { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Login failed. Please try again.");
      setBusy(false);
    }
  }

  const page = {
    minHeight: "100vh",
    background: "transparent",
  };

  const wrap = {
    maxWidth: 820,
    margin: "0 auto",
    padding: "22px 16px 56px",
  };

  const panel = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 28, fontWeight: 950, margin: "0 0 10px" };
  const p = { fontSize: 15, opacity: 0.85, lineHeight: 1.5, margin: "0 0 16px" };

  const row = { display: "grid", gap: 10, marginTop: 10 };

  const label = { fontSize: 13, opacity: 0.8, fontWeight: 800, letterSpacing: 0.2 };
  const input = {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.22)",
    color: "inherit",
    fontSize: 16,
    outline: "none",
  };

  const checkboxRow = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    opacity: 0.9,
  };

  const btn = (primary) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: canSubmit ? "pointer" : "not-allowed",
    opacity: canSubmit ? 1 : 0.65,
  });

  const helperRow = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 12,
  };

  const linkBtn = {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const errBox = {
    marginTop: 12,
    border: "1px solid rgba(255,90,90,0.35)",
    background: "rgba(255,0,0,0.08)",
    borderRadius: 12,
    padding: "10px 12px",
    fontSize: 14,
    lineHeight: 1.4,
  };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={panel}>
          <h1 style={h1}>Log In</h1>
          <p style={p}>
            Enter your business email and access code to reach the Control Center.
          </p>

          <form onSubmit={onSubmit}>
            <div style={row}>
              <div style={label}>Business Email</div>
              <input
                style={input}
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="name@company.com"
                disabled={busy}
              />

              <div style={label}>Access Code</div>
              <input
                style={input}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoComplete="one-time-code"
                placeholder="Enter access code"
                disabled={busy}
              />

              <div style={checkboxRow}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={busy}
                />
                <div style={{ fontSize: 14 }}>
                  Remember this device
                </div>
              </div>

              <button type="submit" style={btn(true)} disabled={!canSubmit}>
                {busy ? "Signing in..." : "Log In"}
              </button>

              {err ? <div style={errBox}>{err}</div> : null}

              <div style={helperRow}>
                <button type="button" style={linkBtn} onClick={() => nav("/join")}>
                  Request Access
                </button>
                <button type="button" style={linkBtn} onClick={() => nav("/")}>
                  Home
                </button>
                <button
                  type="button"
                  style={linkBtn}
                  onClick={() => {
                    clearAuth();
                    setBusinessEmail("");
                    setAccessCode("");
                    setErr("Cleared saved login on this device.");
                  }}
                >
                  Clear Saved Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
