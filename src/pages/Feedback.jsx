import React, { useState } from "react";
import Header from "../components/Header.jsx";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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

    const mailto = `mailto:quecabadbs@gmail.com?subject=${encodeURIComponent(
      `AdbS Feedback — ${subject}`
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatusMsg("Your email app should open now.");
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Feedback / Support</div>

          <div style={styles.subtitle}>
            Found a problem? Have an idea? Need help? Send it here.
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <textarea
              style={styles.textarea}
              placeholder="Tell us what happened, what you expected, or what you'd like changed."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}
            {statusMsg ? <div style={styles.status}>{statusMsg}</div> : null}

            <button type="submit" style={styles.button}>
              Send Feedback
            </button>
          </form>

          <div style={styles.altBox}>
            <div style={styles.altTitle}>Direct Contact</div>
            <div style={styles.altText}>
              If your email app does not open, email:
            </div>
            <a href="mailto:quecabadbs@gmail.com" style={styles.link}>
              quecabadbs@gmail.com
            </a>
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
    maxWidth: 700,
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
  textarea: {
    width: "100%",
    minHeight: 150,
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical"
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
  status: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14
  },
  altBox: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.12)",
    textAlign: "center"
  },
  altTitle: {
    fontSize: 16,
    fontWeight: 900,
    marginBottom: 6
  },
  altText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8
  },
  link: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15
  }
};
