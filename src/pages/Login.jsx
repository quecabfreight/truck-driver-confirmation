import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// LocalStorage keys
const LS_KEY_EMAIL = "quecab-remembered-email";
const LS_KEY_REMEMBER = "quecab-remember-device";

// Styles
const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  },
  // Header bar: remove left label; keep only subtle 'SECURE LOGIN' on right
  topbar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--bg) 96%, black 4%)",
  },
  secure: {
    fontSize: 12,
    fontWeight: 600,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  wrap: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "28px 16px",
  },
  card: {
    width: "100%",
    maxWidth: 560,
    borderRadius: 16,
    background: "linear-gradient(180deg, rgba(22,22,22,0.98), rgba(14,14,14,0.98))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
    padding: 22,
  },

  head: { marginBottom: 16 },

  logoPlateOuter: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
  logoPlate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background: "radial-gradient(ellipse at 40% 30%, rgba(0,0,0,0.85), rgba(0,0,0,0.65))",
    border: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13.5,
    color: "var(--muted)",
    letterSpacing: "0.02em",
  },

  err: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 14.5,
    color: "#fca5a5",
    background: "color-mix(in oklab, var(--bg) 70%, #7f1d1d 30%)",
    border: "1px solid color-mix(in oklab, #ef4444 70%, black 30%)",
    borderRadius: 8,
    padding: "10px 12px",
  },

  form: { marginTop: 6 },

  label: {
    fontSize: 13.5,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    fontSize: 16,
    lineHeight: 1.4,
    color: "var(--text)",
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10,
    padding: "12px 13px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
  },
  row: { marginTop: 14 },

  remember: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    marginTop: 4,
    width: 18,
    height: 18,
    accentColor: "#1f2937",
  },
  rememberText: { fontSize: 13.5 },
  rememberHint: { fontSize: 12.5, color: "var(--muted)" },

  button: {
    width: "100%",
    marginTop: 16,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#e5e7eb",
    background: "linear-gradient(180deg, rgba(18,18,18,1), rgba(0,0,0,1))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  buttonHover: {
    background: "linear-gradient(180deg, rgba(30,30,30,1), rgba(10,10,10,1))",
    borderColor: "rgba(255,255,255,0.16)",
  },

  links: { marginTop: 18, display: "flex", flexDirection: "column", gap: 10 },
  link: {
    fontSize: 14,
    color: "var(--muted)",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  legal: { marginTop: 4, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 },
};

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [err, setErr] = useState("");
  const [btnStyle, setBtnStyle] = useState(s.button);

  // Prefill saved email if device was remembered
  useEffect(() => {
    const savedRemember = localStorage.getItem(LS_KEY_REMEMBER) === "1";
    const savedEmail = savedRemember ? localStorage.getItem(LS_KEY_EMAIL) || "" : "";
    if (savedRemember) {
      setRememberDevice(true);
      setEmail(savedEmail);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !pwd.trim()) {
      setErr("Email and password are required.");
      return;
    }

    if (rememberDevice) {
      localStorage.setItem(LS_KEY_REMEMBER, "1");
      localStorage.setItem(LS_KEY_EMAIL, normalizedEmail);
    } else {
      localStorage.removeItem(LS_KEY_REMEMBER);
      localStorage.removeItem(LS_KEY_EMAIL);
    }

    // TODO: replace with real auth
    setErr("");
    nav("/");
  };

  return (
    <div style={s.page}>
      {/* Header bar (no left brand text) */}
      <div style={s.topbar}>
        <div style={s.secure}>Secure Login</div>
      </div>

      <div style={s.wrap}>
        <div style={s.card}>
          {/* Logo */}
          <div style={s.head}>
            <div style={s.logoPlateOuter}>
              <div style={s.logoPlate}>
                <img
                  src="/qc-logo.png"
                  alt="QueCab AdbS Logo"
                  style={{ width: 220, height: "auto", display: "block" }}
                />
              </div>
            </div>
            <div style={s.title}>
              QueCab <span style={{ color: "var(--muted)", fontWeight: 700 }}>AdbS</span>
            </div>
            <div style={s.subtitle}>Broker / Shipper Access</div>
          </div>

          {/* Error */}
          {err ? <div style={s.err}>{err}</div> : null}

          {/* Form */}
          <form onSubmit={submit} style={s.form}>
            <div style={s.row}>
              <label htmlFor="email" style={s.label}>Business Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                style={s.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div style={s.row}>
              <label htmlFor="pwd" style={s.label}>Password</label>
              <input
                id="pwd"
                type="password"
                placeholder="••••••••"
                style={s.input}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div style={{ ...s.row, ...s.remember }}>
              <input
                id="rememberDevice"
                type="checkbox"
                style={s.checkbox}
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
              />
              <label htmlFor="rememberDevice" style={s.rememberText}>
                Remember this device
                <div style={s.rememberHint}>Do not use on shared / public equipment.</div>
              </label>
            </div>

            <button
              type="submit"
              style={btnStyle}
              onMouseEnter={() => setBtnStyle({ ...s.button, ...s.buttonHover })}
              onMouseLeave={() => setBtnStyle(s.button)}
            >
              SIGN IN
            </button>
          </form>

          <div style={s.links}>
            <a href="/join" style={s.link}>Need access? Request Authorization</a>
            <div style={s.legal}>
              Authorized use only; activity may be monitored and recorded. By continuing you consent to monitoring.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
