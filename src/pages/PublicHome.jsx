import React from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function PublicHome() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.inner}>
          <h1 style={styles.h1}>
            Stop double brokering before the truck gets loaded.
          </h1>

          <p style={styles.sub}>
            Real-time <b>Truck-Driver</b> verification at the dock.
          </p>

          <div style={styles.ctaRow}>
            <button style={styles.btnPrimary} onClick={() => nav("/join")}>
              Request Access
            </button>
            <button style={styles.btnOutline} onClick={() => nav("/login")}>
              Log In
            </button>
          </div>

          <div style={styles.micro}>
            Built for brokers & shippers who require a control point before freight moves.
          </div>
        </div>
      </section>

      {/* VERDICT TEASER */}
      <section style={styles.verdictSection}>
        <div style={styles.innerWide}>
          <div style={styles.sectionTitle}>Dock Verification Outcome</div>

          <div style={styles.verdictGrid}>
            <div style={{ ...styles.verdictCard, ...styles.clearCard }}>
              <div style={styles.verdictLabelClear}>CLEAR</div>
              <div style={styles.verdictMainClear}>CLEAR TO LOAD</div>
            </div>

            <div style={{ ...styles.verdictCard, ...styles.cautionCard }}>
              <div style={styles.verdictLabelCaution}>CAUTION</div>
              <div style={styles.verdictMainCaution}>DO NOT LOAD</div>
            </div>
          </div>

          <div style={styles.bottomLine}>
            Verification happens <b>before</b> freight moves.
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.innerWide}>
          <div style={{ opacity: 0.55, fontSize: 13 }}>
            © {new Date().getFullYear()} QueCab AdbS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
    position: "relative",
  },

  bg: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.9,
    background: [
      "radial-gradient(1200px 600px at 18% 10%, rgba(90,150,240,0.18), rgba(0,0,0,0))",
      "radial-gradient(1000px 520px at 85% 15%, rgba(255,255,255,0.06), rgba(0,0,0,0))",
      "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.30))",
      steelNoise(),
    ].join(", "),
  },

  hero: {
    position: "relative",
    zIndex: 1,
    padding: "56px 0 34px",
  },

  inner: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "22px 20px",
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
  },

  innerWide: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
  },

  h1: {
    fontSize: 50,
    fontWeight: 950,
    letterSpacing: -0.6,
    margin: "0 0 12px",
    lineHeight: 1.04,
  },

  sub: {
    fontSize: 20,
    opacity: 0.82,
    margin: "0 0 18px",
    lineHeight: 1.5,
    maxWidth: 820,
  },

  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  btnPrimary: {
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#fff",
    background:
      "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    border: "1px solid rgba(140,190,255,0.42)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  },

  btnOutline: {
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#e6edf5",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.28)",
  },

  micro: {
    marginTop: 12,
    fontSize: 13,
    opacity: 0.62,
  },

  verdictSection: {
    position: "relative",
    zIndex: 1,
    padding: "32px 0 52px",
  },

  sectionTitle: {
    textAlign: "center",
    fontWeight: 950,
    letterSpacing: 0.7,
    opacity: 0.72,
    textTransform: "uppercase",
    fontSize: 13,
    marginBottom: 22,
  },

  verdictGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  },

  verdictCard: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.24)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: "32px 20px",
    textAlign: "center",
  },

  clearCard: {
    borderColor: "rgba(80,190,120,0.35)",
  },

  cautionCard: {
    borderColor: "rgba(255,90,90,0.35)",
  },

  verdictLabelClear: {
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: 1,
    opacity: 0.85,
    marginBottom: 12,
    color: "rgba(150,255,210,0.9)",
  },

  verdictLabelCaution: {
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: 1,
    opacity: 0.85,
    marginBottom: 12,
    color: "rgba(255,170,170,0.95)",
  },

  verdictMainClear: {
    fontSize: 30,
    fontWeight: 950,
    letterSpacing: 0.6,
    color: "rgba(170,255,220,0.95)",
  },

  verdictMainCaution: {
    fontSize: 30,
    fontWeight: 950,
    letterSpacing: 0.6,
    color: "rgba(255,170,170,0.95)",
  },

  bottomLine: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.75,
  },

  footer: {
    position: "relative",
    zIndex: 1,
    padding: "22px 0",
    borderTop: "1px solid rgba(140,190,255,0.12)",
    background: "rgba(0,0,0,0.18)",
  },
};

function steelNoise() {
  const svg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.35
        0 0 0 0 0.50
        0 0 0 0 0.70
        0 0 0 0.12 0"/>
    </filter>
    <rect width="220" height="220" filter="url(#n)" opacity="0.45"/>
  </svg>`);
  return `url("data:image/svg+xml,${svg}")`;
}
