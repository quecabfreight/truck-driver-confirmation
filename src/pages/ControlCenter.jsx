// /src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

const LS_ACCESS_CODE = "qc_access_code";
const SS_ACCESS_CODE = "qc_access_code_ss";

function looksLikeEmail(v) {
  const s = String(v || "").trim();
  return s.includes("@") && s.includes(".");
}

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState(() => {
    try {
      return (localStorage.getItem(LS_EMAIL) || "").trim();
    } catch {
      return "";
    }
  });

  const [accessCode, setAccessCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  // Load remembered access code
  useEffect(() => {
    let code = "";
    try {
      code = (localStorage.getItem(LS_ACCESS_CODE) || "").trim();
    } catch {}
    if (!code) {
      try {
        code = (sessionStorage.getItem(SS_ACCESS_CODE) || "").trim();
      } catch {}
    }
    setAccessCode(code);
  }, []);

  const authorized = useMemo(() => {
    const e = String(email || "").trim();
    return !!e && isBrokerOrShipper(e);
  }, [email]);

  useEffect(() => {
    // If already authorized, go straight in
    if (authorized) nav("/dashboard", { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorized]);

  function saveAuth() {
    const e = String(email || "").trim();
    const c = String(accessCode || "").trim();
    if (!looksLikeEmail(e)) {
      setErr("Enter a valid business email.");
      return false;
    }
    if (!c) {
      setErr("Enter your access code.");
      return false;
    }

    setErr("");
    setNote("");

    // Save email (authorization in this beta build is email-based)
    try {
      localStorage.setItem(LS_EMAIL, e);
    } catch {}

    // Save access code convenience (Remember device controls where it goes)
    try {
      if (remember) {
        localStorage.setItem(LS_ACCESS_CODE, c);
        try {
          sessionStorage.removeItem(SS_ACCESS_CODE);
        } catch {}
      } else {
        try {
          sessionStorage.setItem(SS_ACCESS_CODE, c);
        } catch {}
        try {
          localStorage.removeItem(LS_ACCESS_CODE);
        } catch {}
      }
    } catch {}

    return true;
  }

  function doLogin() {
    if (!saveAuth()) return;

    // If the email is broker/shipper, the app considers it authorized.
    // (Access code is still stored for your convenience.)
    const e = String(email || "").trim();
    if (!isBrokerOrShipper(e)) {
      setErr("This email is not authorized yet. Request access first.");
      return;
    }

    nav("/dashboard", { replace: true });
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    maxWidth: 560,
    margin: "0 auto",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 26, fontWeight: 950, margin: 0, letterSpacing: 0.2 };
  const sub = { marginTop: 8, opacity: 0.85, lineHeight: 1.4 };

  const label = { fontSize: 14, opacity: 0.92, marginBottom: 6 };
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

  const btn = (primary) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  });

  const checkRow = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
    opacity: 0.9,
    userSelect: "none",
  };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <h1 style={h1}>Log In</h1>
          <div style={sub}>
            Use your business email and access code to reach the Control Center.
          </div>

          <div style={{ marginTop: 14 }}>
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

          <div style={{ marginTop: 12 }}>
            <div style={label}>Access Code</div>
            <input
              style={input}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="QC-XXXXXXX"
              autoComplete="off"
            />
          </div>

          <label style={checkRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember this device
          </label>

          <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
            <button style={btn(true)} onClick={doLogin}>
              Log In
            </button>
            <button style={btn(false)} onClick={() => nav("/join")}>
              Request Access
            </button>
          </div>

          {err ? (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(255,80,80,0.35)",
                background: "rgba(255,80,80,0.08)",
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              <b>Error:</b> {err}
            </div>
          ) : null}

          {note ? (
            <div
              style={{
                marginTop: 12,
                border: "1px solid rgba(120,180,255,0.30)",
                background: "rgba(120,180,255,0.08)",
                padding: 12,
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
