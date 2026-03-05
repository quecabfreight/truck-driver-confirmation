// /src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { setAuthEmail, setAuthRole, setAuthCode, isBrokerOrShipper } from "../utils/auth.js";

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  return s.includes("@") && s.includes(".");
}

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const from = (loc.state && loc.state.from) || "/dashboard";

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Log In — QueCab AdbS";
  }, []);

  const canSubmit = useMemo(() => {
    if (!looksLikeEmail(email)) return false;
    if (!String(code || "").trim()) return false;
    return true;
  }, [email, code]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const eClean = String(email || "").trim().toLowerCase();
    const cClean = String(code || "").trim().toUpperCase();

    if (!looksLikeEmail(eClean)) {
      setError("Enter a valid business email.");
      return;
    }
    if (!cClean) {
      setError("Enter your access code.");
      return;
    }

    setLoading(true);

    try {
      // Minimal login: we store email + code locally and rely on isBrokerOrShipper(email)
      // for gating routes (beta). Admin gating is separate (Admin Key).
      setAuthEmail(eClean, remember);
      setAuthCode(cClean, remember);
      setAuthRole("broker", remember); // default; role is not enforced client-side yet

      // If this email is already on the approved list, go straight in.
      // If not, we still allow them to proceed to request access; BUT we won't route them to dashboard.
      if (isBrokerOrShipper(eClean)) {
        nav(from, { replace: true });
      } else {
        nav("/join", { replace: true });
      }
    } catch {
      setError("Could not save login. Check browser storage settings.");
    } finally {
      setLoading(false);
    }
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 820, margin: "0 auto", padding: "18px 16px 60px" };

  // Tiny industrial polish: steel-ish card + faint rivet line feel (no layout changes)
  const card = {
    border: "1px solid rgba(140,190,255,0.14)",
    background:
      "linear-gradient(180deg, rgba(12,18,28,0.78), rgba(8,12,18,0.72))",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 16px 34px rgba(0,0,0,0.35)",
    position: "relative",
    overflow: "hidden",
  };

  const steelLine = {
    content: '""',
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    background:
      "linear-gradient(90deg, rgba(120,180,255,0.0), rgba(120,180,255,0.45), rgba(120,180,255,0.0))",
    opacity: 0.55,
  };

  const titleRow = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  };

  const logo = { width: 44, height: 44, objectFit: "contain" };
  const h1 = { margin: 0, fontSize: 24, fontWeight: 950, letterSpacing: 0.2 };
  const sub = { marginTop: 4, fontSize: 13, opacity: 0.72, fontWeight: 700 };

  const grid = { display: "grid", gap: 12 };

  const label = { fontSize: 13, opacity: 0.9, fontWeight: 900, marginBottom: 6 };
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

  const btn = (primary) => ({
    width: "100%",
    padding: "14px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(140,190,255,0.20)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    letterSpacing: 0.2,
    opacity: primary ? 1 : 0.95,
  });

  const row = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" };
  const checkbox = { transform: "scale(1.1)" };
  const help = { fontSize: 12, opacity: 0.72, lineHeight: 1.35 };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          {/* pseudo steel line */}
          <div style={steelLine} />

          <div style={titleRow}>
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={logo}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div>
              <h1 style={h1}>Log In</h1>
              <div style={sub}>QueCab AdbS • Secure Your Load</div>
            </div>
          </div>

          <form onSubmit={onSubmit} style={grid}>
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
                style={{ ...input, textTransform: "uppercase", letterSpacing: 1.2 }}
                value={code}
                onChange={(e) => setCode(String(e.target.value || "").toUpperCase())}
                placeholder="QC-XXXXXX"
                inputMode="text"
                autoComplete="off"
              />
              <div style={{ marginTop: 6, ...help }}>
                Tip: Access codes are uppercase.
              </div>
            </div>

            <div style={row}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={checkbox}
              />
              <label htmlFor="remember" style={{ fontWeight: 900, opacity: 0.9 }}>
                Remember this device
              </label>
              <span style={help}>
                (Stores login locally so you don’t retype.)
              </span>
            </div>

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
                <b style={{ letterSpacing: 0.2 }}>Error:</b> {error}
              </div>
            ) : null}

            <button
              type="submit"
              style={{
                ...btn(true),
                opacity: canSubmit && !loading ? 1 : 0.55,
                cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              }}
              disabled={!canSubmit || loading}
              title="Log In"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>

            <button
              type="button"
              style={btn(false)}
              onClick={() => nav("/join")}
              title="Request Access"
            >
              Request Access
            </button>

            <div style={{ marginTop: 6, ...help }}>
              If you don’t have an access code yet, request beta access and we’ll review.
            </div>
          </form>
        </div>

        <div style={{ marginTop: 14, opacity: 0.55, fontSize: 12 }}>
          QueCab AdbS — Truck-Driver verification system. Paid-subscription UI standards enforced.
        </div>
      </div>
    </div>
  );
}
