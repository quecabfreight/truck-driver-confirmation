import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

function isSignedIn() {
  try {
    const email =
      (localStorage.getItem("qc_email") || "").trim() ||
      (sessionStorage.getItem("qc_email") || "").trim();
    return !!email;
  } catch {
    return false;
  }
}

export default function HowItWorks() {
  const signedIn = isSignedIn();

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>How It Works</div>

          <div style={styles.subtitle}>
            Issue a verification link → the driver presents it at check-in → dock personnel enter
            the USDOT# and plate they see on the truck, place the driver call, then submit. If it
            matches, the Truck-Driver is CLEAR TO LOAD. If anything is off, it’s a CAUTION ALERT —
            DO NOT LOAD.
          </div>

          <div style={styles.stepBlock}>
            <div style={styles.stepNumber}>1) Issue</div>
            <div style={styles.stepText}>
              Broker issues one AdbS verification per load. The Load ID ties everything together.
            </div>
          </div>

          <div style={styles.stepBlock}>
            <div style={styles.stepNumber}>2) Verify</div>
            <div style={styles.stepText}>
              Dock enters what they see on the truck: USDOT# and plate, then completes the driver
              call step.
            </div>
          </div>

          <div style={styles.stepBlock}>
            <div style={styles.stepNumber}>3) Decide</div>
            <div style={styles.stepText}>
              System returns a clear, high-contrast verdict: CLEAR TO LOAD or CAUTION ALERT — DO
              NOT LOAD.
            </div>
          </div>

          <div style={styles.ctaRow}>
            {signedIn ? (
              <Link to="/" style={styles.primaryButton}>
                Control Center
              </Link>
            ) : (
              <>
                <Link to="/join" style={styles.primaryButton}>
                  Request Access
                </Link>

                <Link to="/login" style={styles.secondaryButton}>
                  Log In
                </Link>
              </>
            )}
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
    lineHeight: 1.6,
    textAlign: "left",
    marginBottom: 22
  },
  stepBlock: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 6
  },
  stepText: {
    fontSize: 15,
    lineHeight: 1.55,
    opacity: 0.92
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 22
  },
  primaryButton: {
    display: "inline-block",
    minWidth: 180,
    textAlign: "center",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 900
  },
  secondaryButton: {
    display: "inline-block",
    minWidth: 180,
    textAlign: "center",
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 900
  }
};
