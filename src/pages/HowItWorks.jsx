import React from "react";

export default function HowItWorks() {
  return (
    <div style={styles.page}>
      <TopBar active="how" />

      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <div style={styles.title}>How It Works</div>

          <div style={styles.block}>
            <div style={styles.h}>1) Request Access</div>
            <div style={styles.p}>
              Brokers & shippers submit onboarding details. We review and issue authorized access.
            </div>
          </div>

          <div style={styles.block}>
            <div style={styles.h}>2) Issue a Truck-Driver Verify Link</div>
            <div style={styles.p}>
              You send the driver a secure link (driver-facing). Dock/check-in uses the verify link (dock-facing).
            </div>
          </div>

          <div style={styles.block}>
            <div style={styles.h}>3) Verify Before Loading</div>
            <div style={styles.p}>
              Check-in personnel confirm what they see on the truck matches the record, and confirm the driver answered the call.
            </div>
          </div>

          <div style={styles.actions}>
            <a href="#/join" style={styles.button}>
              Request Access
            </a>
            <a href="#/login" style={styles.buttonGhost}>
              Log In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ active }) {
  return (
    <div style={styles.topBar}>
      <div style={styles.brand}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} onError={(e) => (e.currentTarget.style.display = "none")} />
        <div style={styles.brandText}>QueCab AdbS</div>
      </div>

      <div style={styles.nav}>
        <a style={{ ...styles.navLink, ...(active === "home" ? styles.navLinkActive : null) }} href="#/">
          Home
        </a>
        <a style={{ ...styles.navLink, ...(active === "how" ? styles.navLinkActive : null) }} href="#/how-it-works">
          How It Works
        </a>
        <a style={{ ...styles.navLink, ...(active === "login" ? styles.navLinkActive : null) }} href="#/login">
          Log In
        </a>
        <a style={{ ...styles.navLink, ...(active === "join" ? styles.navLinkActive : null) }} href="#/join">
          Request Access
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 700px at 50% 30%, rgba(22, 60, 110, 0.35), rgba(4, 10, 20, 1) 55%, rgba(0,0,0,1) 100%)",
    color: "#e9eef7",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 26px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 44, height: 44, objectFit: "contain", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.7))" },
  brandText: { fontWeight: 800, letterSpacing: 0.2, fontSize: 18 },
  nav: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  navLink: {
    color: "rgba(233, 238, 247, 0.92)",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    borderBottom: "2px solid transparent",
    paddingBottom: 4,
  },
  navLinkActive: { borderBottom: "2px solid rgba(40, 210, 120, 0.95)" },

  centerWrap: { display: "flex", justifyContent: "center", padding: "42px 18px 60px" },
  card: {
    width: "min(900px, 100%)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "linear-gradient(180deg, rgba(10, 20, 40, 0.85), rgba(6, 10, 18, 0.88))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
    padding: 28,
  },
  title: { fontSize: 32, fontWeight: 900, letterSpacing: 0.2, marginBottom: 8 },
  block: { marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" },
  h: { fontSize: 16, fontWeight: 900 },
  p: { marginTop: 6, color: "rgba(233,238,247,0.78)", lineHeight: 1.5, fontSize: 14 },

  actions: { marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" },
  button: {
    display: "inline-block",
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 900,
    fontSize: 14,
    color: "#06120b",
    background: "linear-gradient(180deg, rgba(45, 230, 130, 1), rgba(24, 180, 95, 1))",
    boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
    textDecoration: "none",
  },
  buttonGhost: {
    display: "inline-block",
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 900,
    fontSize: 14,
    color: "rgba(233,238,247,0.92)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    textDecoration: "none",
  },
};
