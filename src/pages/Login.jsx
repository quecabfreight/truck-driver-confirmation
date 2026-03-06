// /src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import {
  getAuthEmail,
  getAuthCode,
  setAuthEmail,
  setAuthCode,
  setAuthRole,
  normalizeEmail,
  normalizeAccessCode,
  formatAccessCodeTyping,
} from "../utils/auth.js";

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  return s.includes("@") && s.includes(".");
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState(() => getAuthEmail() || "");
  const [code, setCode] = useState(() => getAuthCode() || "");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.title = "Log In — QueCab AdbS";
  }, []);

  // If we came from a protected route, go back there after login
  const from = useMemo(() => {
    const p = loc?.state?.from;
    return typeof p === "string" && p.startsWith("/") ? p : "/dashboard";
  }, [loc]);

  const clean = useMemo(() => {
    const e = normalizeEmail(email);
    const c = normalizeAccessCode(code);
    return { e, c };
  }, [email, code]);

  const canSubmit = useMemo(() => {
    if (!looksLikeEmail(clean.e)) return false;
    // Require at least some digits after QC-
    const digits = clean.c.replace(/\D+/g, "");
    if (digits.length < 4) return false;
    return true;
  }, [clean]);

  async function doLogin(e) {
    e?.preventDefault?.();
    setErr("");

    if (!canSubmit) {
      setErr("Enter a valid Business Email and Access Code.");
      return;
    }

    setLoading(true);
    try {
      // Server is the real bouncer.
      // If your API name differs later, we’ll adjust ONE line right here.
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clean.e,
          access_code: clean.c,
        }),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          "Access denied";
        setErr(msg);
        setLoading(false);
        return;
      }

      // If API returns role, save it; otherwise default to broker for now
      const role = String(data?.role || data?.user?.role || "broker").trim().toLowerCase();

      // Persist to the chosen store
      setAuthEmail(clean.e, remember);
      setAuthCode(clean.c, remember);
      setAuthRole(role, remember);

      nav(from, { replace: true });
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const page = { minHeight: "100vh" };
  const wrap = { maxWidth: 540, margin: "0 auto", padding: "18px 16px 60px" };

  const card = {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 16px 38px rgba(0,0,0,0.38)",
    position: "relative",
    overflow: "hidden",
  };

  // Tiny industrial vibe: subtle “brushed metal” strip at top (doesn't change layout)
  const metalStrip = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02), rgba(255,255,255,0.10))",
    opacity: 0.7,
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };
  const sub = { fontSize: 13, opacity: 0.82, marginTop: 8, lineHeight: 1.4 };

  const label = { fontSize: 13, opacity: 0.85, marginBottom: 6, fontWeight: 800 };
  const input = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(140,190,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 18,
    outline: "none",
  };

  const codeInput = {
    ...input,
    letterSpacing: 1.2,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    textTransform: "uppercase",
  };

  const row = { display: "grid", gap: 12, marginTop: 14 };

  const btn = {
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: "1px solid rgba(140,190,255,0.42)",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: canSubmit && !loading ? "pointer" : "not-allowed",
    letterSpacing: 0.2,
    opacity: canSubmit && !loading ? 1 : 0.55,
  };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <div style={metalStrip} aria-hidden="true" />

          <h1 style={h1}>Log In</h1>
          <div style={sub}>
            Use your <b>Business Email</b> and your assigned <b>Access Code</b>.
            <br />
            Email is not case-sensitive. Access Code auto-formats as <b>QC-######</b>.
          </div>

          <form onSubmit={doLogin} style={{ marginTop: 14 }}>
            <div style={row}>
              <div>
                <div style={label}>Business Email</div>
                <input
                  style={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => setEmail(normalizeEmail(e.target.value))}
                  placeholder="name@company.com"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <div style={label}>Access Code</div>
                <input
                  style={codeInput}
                  value={code}
                  onChange={(e) => setCode(formatAccessCodeTyping(e.target.value))}
                  onBlur={(e) => setCode(normalizeAccessCode(e.target.value))}
                  placeholder="QC-757376"
                  inputMode="text"
                  autoComplete="off"
                />
                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.72 }}>
                  Tip: you can type <b>qc757376</b> — it will convert automatically.
                </div>
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, opacity: 0.92 }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember this device
              </label>

              <button type="submit" style={btn} disabled={!canSubmit || loading}>
                {loading ? "Signing in..." : "Log In"}
              </button>

              {err ? (
                <div
                  style={{
                    border: "1px solid rgba(255,90,90,0.35)",
                    background: "rgba(255,90,90,0.08)",
                    padding: 12,
                    borderRadius: 12,
                    fontSize: 14,
                  }}
                >
                  <b>Error:</b> {err}
                </div>
              ) : null}
            </div>
          </form>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.65, lineHeight: 1.45 }}>
          If you don’t have an access code yet, use <b>Request Access</b> on the Home page.
        </div>
      </div>
    </div>
  );
}
