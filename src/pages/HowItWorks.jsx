import React from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function HowItWorks() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      <div style={styles.inner}>
        <div style={styles.titleBlock}>
          <div style={styles.kicker}>How It Works</div>
          <h1 style={styles.h1}>A verification verdict before freight is released.</h1>
          <p style={styles.sub}>
            QueCab AdbS introduces a control point at the dock so decisions are made
            <b> before</b> freight moves. Public overview only — operational workflow stays inside the platform.
          </p>
        </div>

        <div style={styles.grid}>
          <Panel
            title="Purpose"
            desc="Stop double brokering before the truck gets loaded by validating the Truck-Driver pairing at the last safe point."
          />
          <Panel
            title="Verdict"
            desc='The dock receives a clear outcome: "CLEAR TO LOAD" or "CAUTION — DO NOT LOAD."'
          />
          <Panel
            title="Traceability"
            desc="Time-limited verification events create an audit trail without exposing internal operational details publicly."
          />
          <Panel
            title="Access-Controlled"
            desc="Only authorized brokers and shippers can issue verifications. Internal screens and workflows are not public."
          />
        </div>

        <div style={styles.ctaBar}>
          <div style={styles.ctaText}>Want access to the Control Center?</div>
          <div style={styles.ctaBtns}>
            <button style={styles.btnPrimary} onClick={() => nav("/join")}>
              Request Access
            </button>
            <button style={styles.btnOutline} onClick={() => nav("/login")}>
              Log In
            </button>
          </div>
        </div>

        <div style={styles.footerLine}>
          © {new Date().getFullYear()} QueCab AdbS. All rights reserved.
        </div>
      </div>
    </div>
  );
}

function Panel({ title, desc }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>{title}</div>
      <div style={styles.rule} />
      <div style={styles.panelDesc}>{desc}</div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f1722", color: "#e6edf5", position: "relative" },
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
  inner: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "46px 20px 70px" },

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
  h1: { margin: "14px 0 8px", fontSize: 38, fontWeight: 950, letterSpacing: -0.4, lineHeight: 1.08 },
  sub: { margin: 0, fontSize: 16, opacity: 0.78, lineHeight: 1.55, maxWidth: 980 },

  grid: { marginTop: 18, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 },

  panel: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 18,
  },
  panelTitle: { fontSize: 16, fontWeight: 950, letterSpacing: 0.1 },
  rule: { height: 1, background: "rgba(140,190,255,0.12)", margin: "14px 0" },
  panelDesc: { fontSize: 14, opacity: 0.82, lineHeight: 1.6 },

  ctaBar: {
    marginTop: 18,
    border: "1px solid rgba(140,190,255,0.16)",
    background: "rgba(0,0,0,0.24)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  ctaText: { fontSize: 15, fontWeight: 900, opacity: 0.88 },
  ctaBtns: { display: "flex", gap: 10, flexWrap: "wrap" },

  btnPrimary: {
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#fff",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    border: "1px solid rgba(140,190,255,0.42)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  },
  btnOutline: {
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#e6edf5",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.28)",
  },

  footerLine: { marginTop: 18, opacity: 0.55, fontSize: 13 },
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
