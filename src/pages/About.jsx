import React from "react";
import PublicHeader from "../components/PublicHeader";

export default function About() {
  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      <div style={styles.inner}>
        <div style={styles.titleBlock}>
          <div style={styles.kicker}>About</div>
          <h1 style={styles.h1}>Built to stop fraud before freight moves.</h1>
          <p style={styles.sub}>
            QueCab AdbS is an Anti-Double Brokering System designed to reduce exposure to
            unauthorized pickups and double-brokering tactics by introducing a dock-level
            verification decision point.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.panel}>
            <div style={styles.panelTitle}>What AdbS verifies</div>
            <div style={styles.rule} />

            <div style={styles.row}>
              <div style={styles.k}>Carrier</div>
              <div style={styles.v}>
                The legal entity operating under an MC# / USDOT#
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.k}>truck driver</div>
              <div style={styles.v}>
                The individual person operating the truck
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.k}>Truck-Driver</div>
              <div style={styles.v}>
                The verified pair: truck + driver together (what gets cleared to load)
              </div>
            </div>

            <div style={styles.rule} />

            <div style={styles.small}>
              Terminology matters because the risk often comes from mismatched pairings
              (right carrier on paper, wrong truck/driver at the dock).
            </div>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelTitle}>Why it matters</div>
            <div style={styles.rule} />

            <ul style={styles.ul}>
              <li>Fraud can look legitimate until the freight is gone.</li>
              <li>The dock is the last safe decision point.</li>
              <li>QueCab AdbS provides a clear verdict before releasing freight.</li>
              <li>Each verification produces a recorded audit trail.</li>
            </ul>

            <div style={styles.rule} />

            <div style={styles.small}>
              The public site explains the outcome. Detailed operational workflow remains
              inside the platform for authorized users.
            </div>
          </div>
        </div>

        <div style={styles.footerLine}>
          © {new Date().getFullYear()} QueCab AdbS. All rights reserved.
        </div>
      </div>
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
    background: [
      "radial-gradient(1200px 600px at 18% 10%, rgba(90,150,240,0.18), rgba(0,0,0,0))",
      "radial-gradient(1000px 520px at 85% 15%, rgba(255,255,255,0.06), rgba(0,0,0,0))",
      "linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.30))",
      steelNoise(),
    ].join(", "),
    opacity: 0.9,
  },
  inner: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "46px 20px 70px",
  },

  titleBlock: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 22,
  },
  kicker: {
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(140,190,255,0.20)",
    background: "rgba(0,0,0,0.22)",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    opacity: 0.88,
  },
  h1: {
    margin: "14px 0 8px",
    fontSize: 38,
    fontWeight: 950,
    letterSpacing: -0.4,
    lineHeight: 1.08,
  },
  sub: {
    margin: 0,
    fontSize: 16,
    opacity: 0.78,
    lineHeight: 1.55,
    maxWidth: 960,
  },

  grid: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 14,
  },

  panel: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 18,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: 0.1,
  },
  rule: {
    height: 1,
    background: "rgba(140,190,255,0.12)",
    margin: "14px 0",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: 14,
    padding: "10px 0",
    borderBottom: "1px dashed rgba(140,190,255,0.10)",
  },
  k: {
    fontSize: 12,
    opacity: 0.78,
    fontWeight: 950,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  v: {
    fontSize: 14,
    opacity: 0.84,
    lineHeight: 1.55,
  },

  ul: {
    margin: 0,
    paddingLeft: 18,
    lineHeight: 1.65,
    opacity: 0.84,
    fontSize: 14,
  },

  small: {
    fontSize: 13,
    opacity: 0.62,
    lineHeight: 1.5,
  },

  footerLine: {
    marginTop: 18,
    opacity: 0.55,
    fontSize: 13,
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
