import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// -------------------------------------
// CONSTANTS
// -------------------------------------
const LS_KEY_EMAIL = "quecab-remembered-email";
const LS_KEY_REMEMBER = "quecab-remember-device";

// -------------------------------------
// STYLES
// -------------------------------------
const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--bg) 92%, black 8%)",
    fontSize: 14,
    letterSpacing: "0.02em",
    fontWeight: 600,
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
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    boxShadow: "0 28px 90px rgba(0,0,0,0.25)",
    padding: 20,
  },
  head: {
    marginBottom: 14,
  },
  product: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  sub: {
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
    background: "color-mix(in oklab, var(--bg) 80%, black 20%)",
    border: "1px solid color-mix(in oklab, var(--border) 70%, var(--text) 30%)",
    borderRadius: 8,
    padding: "11px 12px",
    outline: "none",
  },
  row: { marginTop: 14 },
  remember: { display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 },
  checkbox: {
    marginTop: 4,
    width: 18,
    height: 18,
    accentColor: "#dc2626",
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
    color: "white",
    background: "#dc2626",
    border: "1px solid color-mix(in oklab, #dc2626 70%, black 30%)",
    borderRadius: 10,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(220,38,38,0.30)",
  },
  links: { marginTop: 18, display: "flex", flexDirection: "column", gap: 10 },
  link: {
    fontSize: 14,
    color: "var(--muted)",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  legal: {
    marginTop: 4,
    fontSize: 12.5,
    color: "var(--muted)",
    lineHeight: 1.5,
  },
};

// -------------------------------------
// MAIN COMPONENT
// -------------------------------------
export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Load saved email if Remember Device was checked
  useEffect(() => {
    const savedRemember = localStorage.getItem(LS_KEY_REMEMBER) === "1";
    const savedEmail = savedRemember ? localStorage.getItem(LS_KEY_EMAIL) || "" : "";
    if (savedRemember) {
      setRememberDevice(true);
      setEmail(savedEmail);
    }
  }, []);

  // ✅ Handle login form submission
  const submit = (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase(); // emails are not case-sensitive
    if (!normalizedEmail || !pwd.trim()) {
      setErr("Email and password are required.");
      return;
    }

    // If "Remember this device" is checked, store email
    if (rememberDevice) {
      localStorage.setItem(LS_KEY_REMEMBER, "1");
      localStorage.setItem(LS_KEY_EMAIL, normalizedEmail);
    } else {
      localStorage.removeItem(LS_KEY_REMEMBER);
      localStorage.removeItem(LS_KEY_EMAIL);
    }

    // Placeholder for real authentication logic
    // TODO: Replace with actual API / authorization check
    if (normalizedEmail.includes("@")) {
      setErr("");
      nav("/"); // Navigate to home if successful
    } else {
      setErr("Unauthorized or invalid email format.");
    }
  };

  return (
    <div style={s.page}>
      {/* Header bar */}
      <div style={s.topbar}>
        <div>QUECAB ADBS</div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase" }}>
          Secure Login
        </div>
      </div>

      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.head}>
            <div style={s.product}>
              QueCab <span style={{ color: "var(--muted)", fontWeight: 700 }}>AdbS</span>
            </div>
            <div style={s.sub}>Broker / Shipper Access</div>
          </div>

          {err ? <div style={s.err}>{err}</div> : null}

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

            <button type="submit" style={s.button}>Sign In</button>
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
