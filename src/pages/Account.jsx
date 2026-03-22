import React, { useState } from "react";
import Header from "../components/Header.jsx";

const LS_EMAIL = "qc_email";

export default function Account() {
  const currentEmail = localStorage.getItem(LS_EMAIL) || "";

  const [businessEmail, setBusinessEmail] = useState(currentEmail);
  const [currentAccessCode, setCurrentAccessCode] = useState("");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [confirmAccessCode, setConfirmAccessCode] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSaveEmail(e) {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");

    const cleanEmail = String(businessEmail || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("Enter a valid business email.");
      return;
    }

    try {
      localStorage.setItem(LS_EMAIL, cleanEmail);
      setStatusMsg("Business email updated on this device.");
    } catch {
      setErrorMsg("Could not save email.");
    }
  }

  function handleSaveAccessCode(e) {
    e.preventDefault();
    setErrorMsg("");
    setStatusMsg("");

    if (!String(currentAccessCode || "").trim()) {
      setErrorMsg("Enter current access code.");
      return;
    }

    if (!String(newAccessCode || "").trim()) {
      setErrorMsg("Enter new access code.");
      return;
    }

    if (String(newAccessCode) !== String(confirmAccessCode)) {
      setErrorMsg("New access code entries do not match.");
      return;
    }

    try {
      localStorage.setItem("qc_access_code", String(newAccessCode).trim());
      setStatusMsg("Access code updated on this device.");
      setCurrentAccessCode("");
      setNewAccessCode("");
      setConfirmAccessCode("");
    } catch {
      setErrorMsg("Could not save access code.");
    }
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Account</div>

          <div style={styles.subtitle}>
            This is the starting place for account changes and recovery tools.
          </div>

          <div style={styles.grid}>
            <form onSubmit={handleSaveEmail} style={styles.formCard}>
              <div style={styles.sectionTitle}>Business Email</div>

              <input
                style={styles.input}
                placeholder="Business Email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />

              <button type="submit" style={styles.button}>
                Save Email
              </button>
            </form>

            <form onSubmit={handleSaveAccessCode} style={styles.formCard}>
              <div style={styles.sectionTitle}>Access Code</div>

              <input
                style={styles.input}
                placeholder="Current Access Code"
                value={currentAccessCode}
                onChange={(e) => setCurrentAccessCode(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="New Access Code"
                value={newAccessCode}
                onChange={(e) => setNewAccessCode(e.target.value)}
              />

              <input
                style={styles.input}
                placeholder="Confirm New Access Code"
                value={confirmAccessCode}
                onChange={(e) => setConfirmAccessCode(e.target.value)}
              />

              <button type="submit" style={styles.button}>
                Save Access Code
              </button>
            </form>
          </div>

          {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}
          {statusMsg ? <div style={styles.status}>{statusMsg}</div> : null}

          <div style={styles.noteBox}>
            <div style={styles.noteTitle}>Coming Next</div>
            <div style={styles.noteText}>
              Password recovery, account recovery, and stronger account management can be added here next.
            </div>
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
    maxWidth: 900,
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16
  },
  formCard: {
    display: "grid",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900
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
    marginTop: 14,
    color: "#ff9c9c",
    fontWeight: 700,
    fontSize: 14
  },
  status: {
    marginTop: 14,
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14
  },
  noteBox: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.12)"
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 900,
    marginBottom: 6
  },
  noteText: {
    fontSize: 14,
    opacity: 0.82,
    lineHeight: 1.5
  }
};
