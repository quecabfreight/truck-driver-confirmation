import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// LocalStorage keys
const LS_EMAIL = "qc_login_email";
const LS_REMEMBER = "qc_login_remember";
const LS_SESSION = "qc_session"; // { email, role, code, ts }

function normalizeEmail(v) {
  return (v || "").trim().toLowerCase();
}

function normalizeCode(v) {
  return (v || "").trim().toUpperCase();
}

// accepts QC-BRK-12345 or QC-SHP-12345 (case-insensitive), with or without hyphens
function parseAccessCode(raw) {
  const code = normalizeCode(raw).replace(/\s+/g, "");
  // Allow both QC-BRK-12345 and QCBRK12345 by re-inserting hyphens for testing
  const withHyphens =
    code.includes("-") ? code : code.replace(/^QC(BRK|SHP)(\d{5})$/, "QC-$1-$2");
  const m = withHyphens.match(/^QC-(BRK|SHP)-(\d{5})$/i);
  if (!m) return null;
  const role = m[1].toUpperCase() === "BRK" ? "broker" : "shipper";
  return { role, code: `QC-${m[1].toUpperCase()}-${m[2]}` };
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prefill from localStorage
  useEffect(() => {
    const r = localStorage.getItem(LS_REMEMBER);
    const e = localStorage.getItem(LS_EMAIL);
    if (r !== null) setRemember(r === "1");
    if (e) setEmail(e);
  }, []);

  // If we already have a session, you could auto-forward. (Kept off by default.)
  // useEffect(() => {
  //   const s = localStorage.getItem(LS_SESSION);
  //   if (s) navigate("/", { replace: true });
  // }, [navigate]);

  function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const nEmail = normalizeEmail(email);
    const parsed = parseAccessCode(code);

    // save email pref if remember is on
    localStorage.setItem(LS_REMEMBER, remember ? "1" : "0");
    if (remember) localStorage.setItem(LS_EMAIL, nEmail);
    else localStorage.removeItem(LS_EMAIL);

    // For now we accept any syntactically valid code and create a local session.
    // When backend is ready, swap this block for a real fetch().
    if (!nEmail) {
      setError("Enter your business email.");
      setSubmitting(false);
      return;
    }
    if (!parsed) {
      setError("Enter a valid access code (e.g., QC-BRK-12345).");
      setSubmitting(false);
      return;
    }

    const session = {
      email: nEmail,
      role: parsed.role,    // 'broker' | 'shipper'
      code: parsed.code,    // normalized QC-XXX-##### format
      ts: Date.now(),
    };
    try {
      localStorage.setItem(LS_SESSION, JSON.stringify(session));
    } catch {}

    // Navigate to the dashboard/home
    navigate("/", { replace: true });
  }

  // ---- Styling (kept aligned with your dark, realistic theme) ----
  const page = {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  };
  const topBar = {
    width: "100%",
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    color: "var(--muted)",
    display: "flex",
    justifyContent: "flex-end",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--border)",
  };
  const wrap = {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  };
  const card = {
    width: "100%",
    maxWidth: 540,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "0 42px 120px rgba(0,0,0,0.22)",
    padding: 22,
  };
  const header = { display: "flex", flexDirection: "column", alignItems: "center", gap: 14 };
  const logoBox = {
    width: 180,
    height: 180,
    borderRadius: 18,
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 18px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
  };
  const hTitle = { fontSize: 18, fontWeight: 900, letterSpacing: "-0.01em" };
  const hSub = { fontSize: 12, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" };

  const form = { marginTop: 10 };
  const row = { marginTop: 14 };
  const label = {
    fontSize: "0.95rem",
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 8,
  };
  const input = {
    width: "100%",
    fontSize: "1rem",
    lineHeight: 1.4,
    color: "var(--text)",
    background: "color-mix(in oklab, var(--card) 96%, white 4%)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 13px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
  };
  const rememberRow = { display: "flex", alignItems: "center", gap: 10, marginTop: 8, color: "var(--muted)", fontSize: 12, fontWeight: 700 };
  const btn = {
    width: "100%",
    marginTop: 16,
    fontSize: "1rem",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#e5e7eb",
    background: "linear-gradient(180deg, rgba(18,18,18,1), rgba(0,0,0,1))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
    opacity: submitting ? 0.7 : 1,
  };
  const linkRow = { marginTop: 14, fontSize: 13, color: "var(--muted)" };
  const err = { marginTop: 10, color: "#ffb4b4", fontSize: 13, fontWeight: 800 };

  return (
    <div style={page}>
      <div style={topBar}>Secure Login</div>

      <div style={wrap}>
        <div style={card}>
          <div style={header}>
            <div style={logoBox}>
              {/* If you have the 220px logo in /public, you can use <img src="/qc-logo.png" alt="QueCab AdbS" style={{width: 140}} /> */}
              <img src="/qc-logo.png" alt="QueCab AdbS" style={{ width: 150, height: "auto", opacity: 0.92 }} />
            </div>
            <div style={hTitle}>QueCab AdbS</div>
            <div style={hSub}>Broker / Shipper Access</div>
          </div>

          <form onSubmit={onSubmit} style={form}>
            <div style={row}>
              <div style={label}>Business Email</div>
              <input
                style={input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                spellCheck="false"
                required
              />
            </div>

            <div style={row}>
              <div style={label}>Access Code</div>
              <input
                style={input}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="QC-BRK-12345"
                required
              />
            </div>

            <div style={rememberRow}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember this device</label>
            </div>

            {error && <div style={err}>{error}</div>}

            <button type="submit" style={btn} disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </button>

            <div style={linkRow}>
              Need access? <Link to="/join">Request Authorization</Link>
            </div>
            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 12 }}>
              Authorized use only; activity may be monitored and recorded. By continuing you consent to monitoring.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
