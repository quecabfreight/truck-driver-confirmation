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
      <div style={styles.steelGlow} />
      <div style={styles.gridOverlay} />

      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.kicker}>DOCK-LEVEL VERIFICATION BEFORE FREIGHT MOVES</div>

        <div style={styles.card}>
          <div style={styles.title}>How QueCab AdbS Works</div>

          <div style={styles.subtitle}>
            QueCab AdbS™ adds a pre-load verification checkpoint before freight is released.
            The broker issues a secure verification link, dock personnel verify what is physically
            present at check-in, and the system returns a clear operational verdict.
          </div>

          <div style={styles.flowGrid}>
            <div style={styles.stepBlock}>
              <div style={styles.stepTop}>
                <div style={styles.stepBadge}>01</div>
                <div style={styles.stepTitle}>Issue Verification</div>
              </div>
              <div style={styles.stepText}>
                The broker creates one AdbS verification for the load. The Load ID, carrier details,
                driver phone, USDOT#, and plate are tied to that verification record.
              </div>
            </div>

            <div style={styles.connector}>→</div>

            <div style={styles.stepBlock}>
              <div style={styles.stepTop}>
                <div style={styles.stepBadge}>02</div>
                <div style={styles.stepTitle}>Verify at Dock</div>
              </div>
              <div style={styles.stepText}>
                Dock personnel open the SmartLink or QR code, enter the USDOT# and plate they see
                on the truck, and complete the driver-answer check.
              </div>
            </div>

            <div style={styles.connector}>→</div>

            <div style={styles.stepBlock}>
              <div style={styles.stepTop}>
                <div style={styles.stepBadge}>03</div>
                <div style={styles.stepTitle}>Act on Verdict</div>
              </div>
              <div style={styles.stepText}>
                If the Truck-Driver matches, the result is CLEAR TO LOAD. If anything is off,
                QueCab AdbS returns CAUTION — DO NOT LOAD before freight is released.
              </div>
            </div>
          </div>

          <div style={styles.verdictPanel}>
            <div style={styles.clearBox}>CLEAR TO LOAD</div>
            <div style={styles.orBox}>OR</div>
            <div style={styles.cautionBox}>CAUTION — DO NOT LOAD</div>
          </div>

          <div style={styles.recordBox}>
            <div style={styles.recordTitle}>Why It Matters</div>
            <div style={styles.recordText}>
              Each verification creates a practical record of what was assigned, what was entered at
              the dock, when the check happened, and what verdict was returned. That gives brokers a
              cleaner way to review load activity when something does not look right.
            </div>
          </div>

          <div style={styles.ctaRow}>
            {signedIn ? (
              <Link to="/dashboard" style={styles.primaryButton}>
                Open Control Center
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
    marginBottom: 10
  },
  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },
  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1120,
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
    padding: 28,
    boxShadow: "0 18px 44px rgba(0,0,0,0.36)"
  },
  title: {
    fontSize: 38,
    fontWeight: 950,
    marginBottom: 14,
    textAlign: "center",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd7e8",
    lineHeight: 1.7,
    textAlign: "center",
    maxWidth: 860,
    margin: "0 auto 30px"
  },
  flowGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr auto 1fr",
    gap: 14,
    alignItems: "stretch"
  },
  stepBlock: {
    border: "1px solid rgba(255,255,255,0.13)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.028))",
    borderRadius: 18,
    padding: 18,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)"
  },
  stepTop: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12
  },
  stepBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(120,180,255,0.45)",
    background:
      "linear-gradient(180deg, rgba(52,120,205,0.34), rgba(12,34,68,0.64))",
    color: "#8fc7ff",
    fontWeight: 950
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 950,
    color: "#ffffff"
  },
  stepText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#d6dfeb"
  },
  connector: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#66809f",
    fontSize: 26,
    fontWeight: 950
  },
  verdictPanel: {
    margin: "30px auto 0",
    maxWidth: 820,
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)"
  },
  clearBox: {
    padding: "18px",
    borderRadius: 14,
    border: "1px solid rgba(90,220,130,0.46)",
    background:
      "linear-gradient(180deg, rgba(25,110,55,0.45), rgba(8,45,24,0.58))",
    fontWeight: 950,
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff"
  },
  cautionBox: {
    padding: "18px",
    borderRadius: 14,
    border: "1px solid rgba(255,95,95,0.48)",
    background:
      "linear-gradient(180deg, rgba(130,28,28,0.46), rgba(64,12,12,0.60))",
    fontWeight: 950,
    fontSize: 18,
    textAlign: "center",
    color: "#ffffff"
  },
  orBox: {
    color: "#94a8c2",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: 1
  },
  recordBox: {
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,9,18,0.30)"
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: 950,
    marginBottom: 8,
    color: "#ffffff"
  },
  recordText: {
    fontSize: 15,
    color: "#d3ddec",
    lineHeight: 1.65
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 26
  },
  primaryButton: {
    display: "inline-block",
    minWidth: 190,
    textAlign: "center",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background:
      "linear-gradient(180deg, rgba(52,120,205,0.72), rgba(26,72,130,0.86))",
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 950,
    boxShadow: "0 10px 22px rgba(0,0,0,0.26)"
  },
  secondaryButton: {
    display: "inline-block",
    minWidth: 190,
    textAlign: "center",
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 950
  }
};
