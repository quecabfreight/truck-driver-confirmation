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
      const payload = {
        email: normEmail(email),
        access_code: normCode(accessCode),
      };

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
          JSON.stringify({
            ok: true,
            email: payload.email,
            role: j?.role || "authorized",
            ts: Date.now(),
          })
        );
      } else {
        localStorage.removeItem("adbs_auth");
      }

      // ✅ HARD redirect (no router weirdness)
      window.location.href = `${window.location.origin}/#/dashboard`;
      return;
    } catch (err) {
      setError(err?.message || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      <div style={styles.inner}>
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

            <label style={{ ...styles.label, marginTop: 12 }}>Access Code</label>
            <input
              style={styles.input}
              type="text"
              autoComplete="one-time-code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="QC-XXXXXX"
            />

            <div style={styles.row}>
              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span style={{ marginLeft: 10 }}>Remember this device</span>
              </label>
            </div>

            {error ? <div style={styles.error}>{error}</div> : null}

            <button style={styles.btn} disabled={!canSubmit} type="submit">
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
  inner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "46px 20px 70px" },

  card: {
    maxWidth: 620,
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 22,
  },
  title: { fontSize: 34, fontWeight: 950, letterSpacing: -0.3, marginBottom: 6 },
  subtitle: { opacity: 0.78, lineHeight: 1.5, marginBottom: 18 },

  label: { display: "block", fontSize: 13, fontWeight: 900, opacity: 0.78, letterSpacing: 0.6, textTransform: "uppercase" },
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
    fontWeight: 750,
  },
  row: { marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" },
  checkboxRow: { display: "flex", alignItems: "center", opacity: 0.9, fontWeight: 750 },

  error: { marginTop: 12, padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,120,120,0.35)", background: "rgba(120,0,0,0.16)", color: "rgba(255,200,200,0.95)", fontWeight: 850 },

  btn: {
    width: "100%",
    marginTop: 14,
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
  note: { marginTop: 10, fontSize: 13, opacity: 0.62 },
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
