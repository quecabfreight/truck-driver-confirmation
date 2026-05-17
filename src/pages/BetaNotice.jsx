import React from "react";
import Header from "../components/Header.jsx";

export default function BetaNotice() {
  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>QueCab AdbS™ Beta Program Notice</div>

          <div style={styles.text}>
            QueCab AdbS™ is currently operating in a limited beta-release phase.
          </div>

          <div style={styles.text}>
            By accessing or using the QueCab AdbS platform, you acknowledge and agree to the following:
          </div>

          <ul style={styles.list}>
            <li>
              QueCab AdbS is an operational verification-assistance platform intended to help brokers perform pre-load Truck-Driver verification procedures before freight is released.
            </li>

            <li>
              The platform is provided during an active beta testing period and may continue to evolve, change, improve, or be updated without prior notice.
            </li>

            <li>
              Users are responsible for independently verifying all carrier, Truck-Driver, freight, and dispatch-related information before releasing freight.
            </li>

            <li>
              QueCab AdbS assists verification workflows but does not guarantee carrier legitimacy, freight security, legal compliance, or prevention of fraud in every circumstance.
            </li>

            <li>
              Users remain solely responsible for operational decisions, freight release decisions, and compliance with all applicable laws, regulations, broker procedures, and internal company policies.
            </li>

            <li>
              Access may be modified, restricted, suspended, or revoked during beta operations as needed to maintain platform integrity, security, or operational control.
            </li>

            <li>
              Beta features, workflows, notifications, and verification tools may occasionally experience interruptions, delays, inaccuracies, or temporary unavailability while the platform continues development and testing.
            </li>

            <li>
              QueCab AdbS may collect operational activity, verification activity, usage logs, and related system events for security, troubleshooting, auditing, fraud-prevention, and product-improvement purposes.
            </li>

            <li>
              Unauthorized reproduction, reverse engineering, misuse, circumvention, or abuse of the QueCab AdbS platform, workflows, or verification processes is prohibited.
            </li>

            <li>
              QueCab AdbS™ is Patent Pending technology owned and/or developed by Omnimobile Inc.
            </li>
          </ul>

          <div style={styles.text}>
            Use of the QueCab AdbS platform constitutes acknowledgment and acceptance of this beta program notice.
          </div>

          <div style={styles.footer}>
            © 2026 Omnimobile Inc. All Rights Reserved. • QueCab AdbS™ — Patent Pending.
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
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 20px 50px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 28,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  },

  title: {
    fontSize: 30,
    fontWeight: 900,
    marginBottom: 22,
    textAlign: "center"
  },

  text: {
    fontSize: 15,
    lineHeight: 1.7,
    opacity: 0.88,
    marginBottom: 18
  },

  list: {
    paddingLeft: 24,
    display: "grid",
    gap: 14,
    lineHeight: 1.7,
    opacity: 0.9,
    marginBottom: 20
  },

  footer: {
    marginTop: 30,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,0.10)",
    textAlign: "center",
    fontSize: 13,
    opacity: 0.68
  }
};
