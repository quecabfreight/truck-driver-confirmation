import React, { useState } from "react";
import Header from "../components/Header.jsx";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg("");
    setStatusMsg("");

    if (!String(name || "").trim()) {
      setErrorMsg("Enter your name.");
      return;
    }

    if (!String(email || "").trim()) {
      setErrorMsg("Enter your email.");
      return;
    }

    if (!String(subject || "").trim()) {
      setErrorMsg("Enter a subject.");
      return;
    }

    if (!String(message || "").trim()) {
      setErrorMsg("Enter your message.");
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      message
    ].join("\n");

    window.location.href =
      `mailto:quecabadbs@gmail.com?subject=${encodeURIComponent(
        `AdbS Feedback — ${subject}`
      )}` +
      `&body=${encodeURIComponent(body)}`;

    setStatusMsg("Your email app should open now.");
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
        <div style={styles.kicker}>SUPPORT • FEEDBACK • OPERATIONS</div>

        <div style={styles.card}>
          <div style={styles.title}>Feedback & Support</div>

          <div style={styles.subtitle}>
            Report an issue, request a feature, ask an operational question, or
            provide feedback during the QueCab AdbS™ founding beta phase.
          </div>

          <div style={styles.noticePanel}>
            <div style={styles.noticeTitle}>Founding Beta Support</div>

            <div style={styles.noticeText}>
              During beta, feedback from active brokers directly influences
              platform refinement, workflow improvements, and operational
              adjustments.
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Your Name</div>

              <input
                style={styles.input}
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Business Email</div>

              <input
                style={styles.input}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Subject</div>

              <input
                style={styles.input}
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Message</div>

              <textarea
                style={styles.textarea}
                placeholder="Tell us what happened, what needs improvement, or what operational issue you encountered."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {errorMsg ? (
              <div style={styles.error}>{errorMsg}</div>
            ) : null}

            {statusMsg ? (
              <div style={styles.status}>{statusMsg}</div>
            ) : null}

            <button type="submit" style={styles.button}>
              Send Feedback
            </button>
          </form>

          <div style={styles.contactPanel}>
            <div style={styles.contactTitle}>Direct Contact</div>

            <a
              href="mailto:quecabadbs@gmail.com"
              style={styles.contactLink}
            >
              quecabadbs@gmail.com
            </a>

            <div style={styles.contactText}>
              Operational support and beta coordination.
            </div>
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
    maxWidth: 760,
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
    fontSize: 38,
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
    marginBottom: 22
  },

  noticePanel: {
    border: "1px solid rgba(120,180,255,0.28)",
    background:
      "linear-gradient(180deg, rgba(30,80,150,0.22), rgba(8,20,40,0.34))",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24
  },

  noticeTitle: {
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 8
  },

  noticeText: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "#d5e1f0"
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

  textarea: {
    width: "100%",
    minHeight: 180,
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.20)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045))",
    color: "#ffffff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
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

  status: {
    color: "#9cffbd",
    fontWeight: 800,
    fontSize: 14
  },

  contactPanel: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,9,18,0.30)",
    textAlign: "center"
  },

  contactTitle: {
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 10
  },

  contactLink: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 16
  },

  contactText: {
    marginTop: 10,
    color: "#d3ddec",
    fontSize: 14
  }
};
