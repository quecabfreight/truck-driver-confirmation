import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { setSession } from "../lib/session";

export default function Login() {
  const navigate = useNavigate();

  const [businessEmail, setBusinessEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const normalizedEmail = useMemo(
    () => businessEmail.trim().toLowerCase(),
    [businessEmail]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!normalizedEmail) {
      setErrorMsg("Please enter your business email.");
      return;
    }
    if (!accessCode.trim()) {
      setErrorMsg("Please enter your access code.");
      return;
    }

    setLoading(true);
    try {
      // Find the applicant row by business email (case-insensitive).
      // Using ilike avoids casing issues.
      const { data, error } = await supabase
        .from("beta_requests")
        .select("business_email, approved, access_code")
        .ilike("business_email", normalizedEmail)
        .limit(1);

      if (error) throw error;

      const row = Array.isArray(data) && data.length ? data[0] : null;

      // Keep errors generic (don’t leak whether email exists or approval state).
      if (!row) {
        setErrorMsg("Login failed. Check your email and access code.");
        return;
      }

      const approved = !!row.approved;
      const dbCode = (row.access_code || "").trim();
      const enteredCode = accessCode.trim();

      if (!approved || !dbCode || dbCode !== enteredCode) {
        setErrorMsg("Login failed. Check your email and access code.");
        return;
      }

      const sessionObj = {
        email: normalizedEmail,
        approved: true,
        login_at: new Date().toISOString(),
      };

      if (rememberDevice) {
        setSession(sessionObj);
      } else {
        // If they don’t want to remember, store it for this tab session only.
        // (Still uses localStorage key pattern, but cleared on unload.)
        setSession(sessionObj);
        window.addEventListener(
          "beforeunload",
          () => {
            try {
              localStorage.removeItem("qc_session");
            } catch {}
          },
          { once: true }
        );
      }

      // Redirect to Home (smart home: shows Control Center when logged in)
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.brandRow}>
          <a href="/#/" style={styles.brandLink} aria-label="Go Home">
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={styles.logo}
              draggable="false"
            />
          </a>
          <div style={styles.brandText}>
            <div style={styles.brandTitle}>QueCab AdbS</div>
            <div style={styles.brandSub}>
              Authorized Access — Brokers &amp; Shippers Only
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Log In</div>

          <form onSubmit={onSubmit} style={styles.form}>
            <label style={styles.label}>
              Business Email
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="username"
                style={styles.input}
              />
            </label>

            <label style={styles.label}>
              Access Code
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter your access code"
                autoComplete="current-password"
                style={styles.input}
              />
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
              />
              <span style={styles.checkboxText}>Remember this device</span>
            </label>

            {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Checking..." : "Log In"}
            </button>

            <div style={styles.helperRow}>
              <a href="/#/" style={styles.linkButton}>
                Back to Home
              </a>
              <a href="/#/join" style={styles.linkButton}>
                Request Access
              </a>
            </div>
          </form>
        </div>

        <div style={styles.footer}>
          © {new Date().getFullYear()} QueCab AdbS
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(58, 110, 160, 0.20), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30, 80, 140, 0.18), transparent 55%), #06090f",
    color: "#e9eef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  shell: { width: "100%", maxWidth: 560 },
  brandRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  brandLink: { display: "inline-flex", alignItems: "center" },
  logo: { width: 220, height: "auto" },
  brandText: { lineHeight: 1.15 },
  brandTitle: { fontSize: 22, fontWeight: 800, letterSpacing: 0.2 },
  brandSub: { fontSize: 14, color: "rgba(233, 238, 247, 0.75)" },
  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 20, fontWeight: 800, marginBottom: 12 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { fontSize: 14, color: "rgba(233, 238, 247, 0.9)" },
  input: {
    width: "100%",
    marginTop: 6,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.25)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 16,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    userSelect: "none",
  },
  checkboxText: { fontSize: 14, color: "rgba(233, 238, 247, 0.85)" },
  error: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
  },
  button: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background:
      "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 800,
    fontSize: 16,
  },
  helperRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 4,
  },
  linkButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(14, 22, 38, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.9)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    flex: 1,
  },
  footer: {
    marginTop: 14,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
