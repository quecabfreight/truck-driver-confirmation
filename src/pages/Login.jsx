// /src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";

import {
  setAuthEmail,
  setAuthRole,
  setAuthCode,
  setRememberDevice,
  getAuthEmail,
  getAuthCode,
  isRememberedDevice,
  isBrokerOrShipper,
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

  const [email, setEmail] = useState(() => getAuthEmail());
  const [code, setCode] = useState(() => getAuthCode());
  const [remember, setRemember] = useState(() => isRememberedDevice());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = (loc.state && loc.state.from) || "/dashboard";

  useEffect(() => {
    document.title = "Log In — QueCab AdbS";
  }, []);

  // If already authorized, bounce straight to dashboard
  useEffect(() => {
    const e = String(email || "").trim();
    if (e && isBrokerOrShipper(e)) {
      nav("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canSubmit = useMemo(() => {
    const e = String(email || "").trim();
    const c = String(code || "").trim();
    return looksLikeEmail(e) && c.length >= 4;
  }, [email, code]);

  async function doLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const e1 = String(email || "").trim();
    const c1 = String(code || "").trim().toUpperCase();

    if (!looksLikeEmail(e1)) {
      setLoading(false);
      setError("Enter a valid business email.");
      return;
    }
    if (c1.length < 4) {
      setLoading(false);
      setError("Enter your access code.");
      return;
    }

    try {
      // Primary endpoint (most likely)
      let res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e1, access_code: c1 }),
      });

      // Back-compat fallbacks (won’t break if missing)
      if (res.status === 404) {
        res = await fetch("/api/beta_login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: e1, access_code: c1 }),
        });
      }

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Login failed (${res.status}).`;
        setLoading(false);
        setError(msg);
        return;
      }

      const role =
        data?.role ||
        data?.auth?.role ||
        (data?.user && data.user.role) ||
        "broker";

      setAuthEmail(e1);
      setAuthRole(role);
      setAuthCode(c1);

      // Remember device means: keep email+code persisted.
      setRememberDevice(!!remember);

      if (!remember) {
        // If they *don’t* want device remembered, drop the stored code immediately.
        // (Email can stay; harmless + improves UX.)
        setAuthCode("");
      }

      nav(from, { replace: true });
    } catch {
      setError("Network error during login.");
    } finally {
      setLoading(false);
    }
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 860, margin: "0 auto", padding: "18px 16px 54px" };

  const panel = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
    position: "relative",
    overflow: "hidden",
  };

  // Subtle “industrial plate” detail (no layout change)
  const plate = {
    position: "absolute",
    inset: "-2px -2px auto -2px",
    height: 74,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
    borderBottom: "1px solid rgba(140,190,255,0.12)",
    pointerEvents: "none",
  };

  const rivet = (left) => ({
    position: "absolute",
    top: 18,
    left,
    width: 12,
    height: 12,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 55%, rgba(0,0,0,0.20))",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
    opacity: 0.75,
    pointerEvents: "none",
  });

  const h1 = { fontSize: 28, fontWeight: 950, margin: "0 0 6px" };
  const sub = { fontSize: 14, opacity: 0.82, margin: 0, lineHeight: 1.5 };

  const label = { fontSize: 13, opacity: 0.85, marginBottom: 6, fontWeight: 800 };
  const input = {
    width: "100%",
    padding: "14px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 18,
    outline: "none",
  };

  const btn = (primary) => ({
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: primary ? "pointer" : "default",
    letterSpacing: 0.2,
    opacity: primary ? 1 : 0.95,
  });

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={panel}>
          <div style={plate} aria-hidden="true" />
          <div style={rivet(18)} aria-hidden="true" />
          <div style={rivet("calc(100% - 30px)")} aria-hidden="true" />

          <div style={{ position: "relative" }}>
            <h1 style={h1}>Log In</h1>
            <p style={sub}>
              Use your business email and access code to reach the Control Center.
            </p>

            <form onSubmit={doLogin} style={{ marginTop: 14 }}>
              <div style={{ display: "grid", gap: 12 }}>
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

                <div>
                  <div style={label}>Access Code</div>
                  <input
                    style={input}
                    value={code}
                    onChange={(e) => setCode(String(e.target.value || "").toUpperCase())}
                    placeholder="QC-XXXXXXX"
                    inputMode="text"
                    autoComplete="off"
                  />
                  <div style={{ fontSize: 12, opacity: 0.68, marginTop: 6 }}>
                    Auto-caps enabled.
                  </div>
                </div>

                <label style={{ display: "flex", gap: 10, alignItems: "center", opacity: 0.9 }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    style={{ transform: "scale(1.15)" }}
                  />
                  <span style={{ fontWeight: 800 }}>Remember this device</span>
                </label>

                <button
                  type="submit"
                  style={{ ...btn(true), opacity: canSubmit && !loading ? 1 : 0.55 }}
                  disabled={!canSubmit || loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                {error ? (
                  <div
                    style={{
                      border: "1px solid rgba(255,90,90,0.35)",
                      background: "rgba(255,90,90,0.08)",
                      padding: 12,
                      borderRadius: 12,
                      fontSize: 14,
                    }}
                  >
                    <b>Error:</b> {error}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
