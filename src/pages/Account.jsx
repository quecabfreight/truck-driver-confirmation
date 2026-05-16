import React from "react";
import Header from "../components/Header.jsx";

export default function Account() {
  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Account Support</div>

          <div style={styles.subtitle}>
            Account changes are handled manually during beta to protect broker access and prevent lockouts.
          </div>

          <div style={styles.grid}>
            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>Email Changes</div>
              <div style={styles.text}>
                To change the business email tied to your QueCab AdbS access,
                contact QueCab AdbS support. Your login email must be updated
                centrally before it can be used on another device.
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.sectionTitle}>Access Code Resets</div>
              <div style={styles.text}>
                Access code resets are handled by QueCab AdbS during beta.
                This helps keep broker accounts controlled, traceable, and
                protected from accidental lockouts.
              </div>
            </div>
          </div>

          <div style={styles.noteBox}>
            <div style={styles.noteTitle}>Need account help?</div>
            <div style={styles.noteText}>
              Use Feedback or contact QueCab AdbS directly for account recovery,
              email updates, or access code reset requests.
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
    color: "#e6edf5",
  },
  heroLogoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10,
  },
  heroLogo: {
    width: 220,
    maxWidth: "90%",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 20px 40px",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.82,
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 22,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  infoCard: {
    display: "grid",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 900,
  },
  text: {
    fontSize: 14,
    opacity: 0.84,
    lineHeight: 1.55,
  },
  noteBox: {
    marginTop: 18,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 900,
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    opacity: 0.82,
    lineHeight: 1.5,
  },
};
