import React from "react";
import { Link } from "react-router-dom";

const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--bg) 96%, white 4%)",
  },
  brand: {
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  wrap: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  },
  shell: {
    width: "100%",
    maxWidth: "860px", // wider so the UI doesn’t look “tiny” on desktop
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 18,
    boxShadow: "0 42px 120px rgba(0,0,0,0.22)",
    padding: "26px",
  },

  // LOGO AREA — natural with a soft halo (no visible square plate)
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 12,
    position: "relative",
  },
  logoHalo: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: 18,
    boxShadow:
      "0 0 80px 12px rgba(0,0,0,0.06)", // very soft vignette to help the logo pop without a plate
  },
  logo: {
    width: 260, // bigger logo per your note
    height: "auto",
    display: "block",
  },

  hProduct: {
    marginTop: 6,
    textAlign: "center",
    fontSize: "1.35rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  hSub: {
    textAlign: "center",
    marginTop: 6,
    fontSize: "0.95rem",
    color: "var(--muted)",
  },

  // CALL-TO-ACTION BOXES (bigger)
  boxes: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  box: {
    background: "color-mix(in oklab, var(--card) 92%, white 8%)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
  },
  boxTitle: {
    fontWeight: 800,
    fontSize: "1.05rem",
    letterSpacing: "-0.01em",
  },
  boxDesc: {
    marginTop: 4,
    fontSize: "0.95rem",
    color: "var(--muted)",
    lineHeight: 1.55,
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: "0.85rem",
    color: "var(--muted)",
  },
};

export default function Home() {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.brand}>QueCab <span style={{ color: "var(--muted)" }}>AdbS</span></div>
        <div style={{ fontSize: "0.8rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
          Secure Your Load
        </div>
      </div>

      <div style={s.wrap}>
        <div style={s.shell}>
          {/* Natural logo (no square plate) */}
          <div style={s.logoWrap}>
            <div style={s.logoHalo} />
            <img src="/qc-logo.png" alt="QueCab AdbS" style={s.logo} />
          </div>

          <div style={s.hProduct}>QueCab <span style={{ color: "var(--muted)" }}>AdbS</span></div>
          <div style={s.hSub}>Secure Your Load</div>

          {/* Big professional info boxes */}
          <div style={s.boxes}>
            <div style={s.box}>
              <div style={s.boxTitle}>Request Access</div>
              <div style={s.boxDesc}>Brokers / Shippers — apply for authorization.</div>
            </div>

            <div style={s.box}>
              <div style={s.boxTitle}>Already Authorized? Log In</div>
              <div style={s.boxDesc}>
                Use your QueCab AdbS code to unlock verification tools.
              </div>
            </div>

            <div style={s.box}>
              <div style={s.boxTitle}>What is QueCab AdbS?</div>
              <div style={s.boxDesc}>
                QueCab AdbS is an Anti-Double Brokering System. We confirm who is actually
                hauling your freight, and we warn you when something doesn’t match at the dock.
              </div>
            </div>
          </div>

          <div style={s.footer}>
            Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab Inc.
          </div>
        </div>
      </div>
    </div>
  );
}
