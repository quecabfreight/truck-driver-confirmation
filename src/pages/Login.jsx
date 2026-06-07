import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import {
  LS_EMAIL,
  setAuthEmail,
  setAuthRole,
  setAuthCode,
  setRememberDevice,
  clearAuth,
  formatAccessCodeTyping
} from "../utils/auth.js";

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [rememberDevice, setRememberDeviceState] = useState(true);
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved =
        (localStorage.getItem(LS_EMAIL) || "").trim() ||
        (sessionStorage.getItem(LS_EMAIL) || "").trim();

      if (saved) {
        nav("/dashboard", { replace: true });
      }
    } catch {}
  }, [nav]);

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/login_broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          access_code: accessCode
        })
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || "Login failed.");
        setLoading(false);
        return;
      }

      clearAuth();

      setAuthEmail(data.email, rememberDevice);
      setAuthRole(data.role || "broker", rememberDevice);
      setAuthCode(accessCode, rememberDevice);
      setRememberDevice(rememberDevice, rememberDevice);

      nav("/dashboard", { replace: true });
    } catch {
      setErrorMsg("Network error during login.");
    }

    setLoading(false);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.steelGlow} />
      <div style={styles.gridOverlay} />

      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.kicker}>SECURE BROKER ACCESS</div>

        <div style={styles.card}>
          <div style={styles.title}>Broker Login</div>

          <div style={styles.subtitle}>
            Enter your approved business email and QueCab AdbS™ access code to
            continue setup or access your broker workspace.
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Business Email</div>

              <input
                style={styles.input}
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Access Code</div>

              <div style={styles.codeWrap}>
                <input
                  style={styles.input}
                  type={showAccessCode ? "text" : "password"}
                  placeholder="QC-123456"
                  value={accessCode}
                  onChange={(e) =>
                    setAccessCode(formatAccessCodeTyping(e.target.value))
                  }
                  autoComplete="off"
                />

                <button
                  type="button"
                  style={styles.toggleBtn}
                  onClick={() => setShowAccessCode((v) => !v)}
                >
                  {showAccessCode ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label style={styles.checkRow}>
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDeviceState(e.target.checked)}
              />

              <span>Remember this device</span>
            </label>

            {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Signing In..." : "Log In"}
            </button>
          </form>

          <div style={styles.securityBox}>
            <div style={styles.securityTitle}>
              Approved Broker Access
            </div>

            <div style={styles.securityText}>
              Approved brokers may be directed to activate a subscription before
              entering the QueCab AdbS™ Control Center.
            </div>
          </div>

          <div style={styles.bottomText}>
            Need access?{" "}
            <Link to="/join" style={styles.link}>
              Request Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #070b11 0%, #0d1522 48%, #111d2c 100%)",
    color: "#e6edf5",
    overflow: "hidden"
  },

  steelGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(0,85,190,0.22), transparent 38%), radial-gradient(circle at bottom right, rgba(120,160,210,0.10), transparent 34%)"
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    opacity: 0.075,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "42px 42px"
  },

  heroLogoWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 12
  },

  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },

  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 640,
    margin: "0 auto",
    padding: "0 20px 60px"
  },

  kicker: {
    textAlign: "center",
    color: "#8fc7ff",
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 13,
    marginBottom: 14
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.035))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 18px 44px rgba(0,0,0,0.36)"
  },

  title: {
    fontSize: 36,
    fontWeight: 950,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: "-0.4px"
  },

  subtitle: {
    fontSize: 16,
    color: "#cbd7e8",
    lineHeight: 1.7,
    textAlign: "center",
    marginBottom: 26
  },

  form: {
    display: "grid",
    gap: 16
  },

  inputGroup: {
    display: "grid",
    gap: 8
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1,
    color: "#8fc7ff"
  },

  codeWrap: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    alignItems: "center"
  },

  input: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.20)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045))",
    color: "#ffffff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
  },

  toggleBtn: {
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
    color: "#fff",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "#d3ddec"
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(120,180,255,0.55)",
    background:
      "linear-gradient(180deg, rgba(52,120,205,0.72), rgba(26,72,130,0.86))",
    color: "#fff",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(0,0,0,0.28)"
  },

  error: {
    color: "#ff9c9c",
    fontWeight: 800,
    fontSize: 14
  },

  securityBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(3,9,18,0.30)"
  },

  securityTitle: {
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 8
  },

  securityText: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "#d3ddec"
  },

  bottomText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#c9d6e6"
  },

  link: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 900
  }
};
