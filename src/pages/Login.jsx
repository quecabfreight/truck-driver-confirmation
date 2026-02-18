import React, { useMemo, useState } from "react";
import PublicHeader from "../components/PublicHeader";

function normEmail(v) {
  return String(v || "").trim().toLowerCase();
}
function normCode(v) {
  return String(v || "").trim();
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return normEmail(email).length > 3 && normCode(accessCode).length > 2 && !loading;
  }, [email, accessCode, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { email: normEmail(email), access_code: normCode(accessCode) };

      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok || !j?.ok) {
        setError(j?.error || "Login failed");
        setLoading(false);
        return;
      }

      if (remember) {
        localStorage.setItem(
          "adbs_auth",
          JSON.stringify({ ok: true, email: payload.email, role: j?.role || "authorized", ts: Date.now() })
        );
      }

      window.location.replace(`${window.location.origin}/#/dashboard`);
    } catch (err) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <div style={styles.title}>Log In</div>
          <div style={styles.subtitle}>
            Authorized brokers and shippers only. Enter your Business Email and Access Code.
          </div>

          <form onSubmit={onSubmit}>
            <label style={styles.label}>Business Email</label>
            <input
              style={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />

            <label style={{ ...styles.label, marginTop: 14 }}>Access Code</label>
            <input
              style={styles.input}
              type="text"
              autoComplete="one-time-code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="QC-XXXXXX"
            />

            <div style={styles.checkboxRow}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span style={{ marginLeft: 10 }}>Remember this device</span>
            </div>

            <div style={styles.helpRow}>
              <a
                style={styles.helpLink}
                href="mailto:quecabadbs@gmail.com?subject=QueCab%20AdbS%20Help%20-%20Forgot%20Access%20Code&body=Hi%20QueCab%20AdbS%20Support,%0D%0A%0D%0AI%20need%20help%20recovering%20my%20Access%20Code.%0D%0A%0D%0ABusiness%20Email:%20%0D%0ACompany/Legal%20Name:%20%0D%0ARole%20(Broker/Shipper):%20%0D%0A%0D%0AThanks."
              >
                Forgot Access Code?
              </a>

              <a
                style={styles.helpLink}
                href="mailto:quecabadbs@gmail.com?subject=QueCab%20AdbS%20Help%20-%20Forgot%20Business%20Email&body=Hi%20QueCab%20AdbS%20Support,%0D%0A%0D%0AI%20need%20help%20finding%20the%20Business%20Email%20used%20for%20my%20account.%0D%0A%0D%0ACompany/Legal%20Name:%20%0D%0AContact%20Name:%20%0D%0APhone:%20%0D%0A%0D%0AThanks."
              >
                Forgot Business Email?
              </a>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button style={styles.btnPrimary} disabled={!canSubmit}>
              {loading ? "Signing in…" : "Log In"}
            </button>

            <div style={styles.note}>After login you will be taken directly to the Control Center.</div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f1722", color: "#e6edf5", position: "relative" },
  bg: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.9,
    background: [
      "radial-gradient(1200px 600px at 18% 10%, rgba(90,150,240,0.18), rgba(0,0,0,0))",
      "radial-gradient(1000px 520px at 85% 15%, rgba(255,255,255,0.06), rgba(0,0,0,0))",
      "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.30))",
      steelNoise(),
    ].join(", "),
  },

  centerWrap: {
    position: "relative",
    zIndex: 1,
    minHeight: "calc(100vh - 90px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  card: {
    width: "100%",
    maxWidth: 620,
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.24)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 24,
  },

  title: { fontSize: 34, fontWeight: 950, marginBottom: 8 },
  subtitle: { opacity: 0.78, lineHeight: 1.5, marginBottom: 20 },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 900,
    opacity: 0.75,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  input: {
    width: "100%",
    marginTop: 8,
    padding: "14px 14px",
    borderRadius: 10,
    border: "1px solid rgba(140,190,255,0.18)",
    background: "rgba(10,16,26,0.55)",
    color: "#e6edf5",
    outline: "none",
    fontSize: 16,
    fontWeight: 700,
  },

  checkboxRow: { marginTop: 16, display: "flex", alignItems: "center", opacity: 0.9, fontWeight: 700 },

  helpRow: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  helpLink: {
    color: "rgba(170,210,255,0.92)",
    fontWeight: 850,
    textDecoration: "none",
    borderBottom: "1px dotted rgba(170,210,255,0.35)",
    paddingBottom: 2,
  },

  error: {
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,120,120,0.35)",
    background: "rgba(120,0,0,0.16)",
    color: "rgba(255,200,200,0.95)",
    fontWeight: 800,
  },

  btnPrimary: {
    width: "100%",
    marginTop: 18,
    padding: "16px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "#fff",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    border: "1px solid rgba(140,190,255,0.42)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  },

  note: { marginTop: 12, fontSize: 13, opacity: 0.6, textAlign: "center" },
};

function steelNoise() {
  const svg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.35
        0 0 0 0 0.50
        0 0 0 0 0.70
        0 0 0 0.12 0"/>
    </filter>
    <rect width="220" height="220" filter="url(#n)" opacity="0.45"/>
  </svg>`);
  return `url("data:image/svg+xml,${svg}")`;
}
