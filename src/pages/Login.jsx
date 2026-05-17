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
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Log In</div>

          <div style={styles.subtitle}>
            Enter your business email and access code to reach the Control Center.
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              type="email"
              placeholder="Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div style={styles.codeWrap}>
              <input
                style={styles.input}
                type={showAccessCode ? "text" : "password"}
                placeholder="Access Code"
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
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

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
    minHeight: "100vh",
    background: "#0c121c",
    color: "#e6edf5"
  },

  heroLogoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10
  },

  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },

  container: {
    maxWidth: 620,
    margin: "0 auto",
    padding: "0 20px 40px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  },

  title: {
    fontSize: 30,
    fontWeight: 900,
    marginBottom: 10,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 15,
    opacity: 0.82,
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 22
  },

  form: {
    display: "grid",
    gap: 12
  },

  codeWrap: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    alignItems: "center"
  },

  input: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none"
  },

  toggleBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },

  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    opacity: 0.9
  },

  button: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer"
  },

  error: {
    color: "#ff9c9c",
    fontWeight: 700,
    fontSize: 14
  },

  bottomText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.88
  },

  link: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 800
  }
};
