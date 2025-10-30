import React from "react";
import ThemeToggle from "../components/ThemeToggle";

const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background:
      "radial-gradient(circle at 20% 0%, rgba(40,40,40,0.08) 0%, rgba(0,0,0,0.0) 60%), var(--bg)",
    color: "var(--text)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji'",
  },
  header: {
    width: "100%",
    maxWidth: 800,
    textAlign: "center",
    paddingTop: 24,
    paddingBottom: 12,
    color: "var(--text)",
    fontWeight: 600,
    letterSpacing: "-0.03em",
    fontSize: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  title: { margin: "0 auto" },
  card: {
    width: "100%",
    maxWidth: 800,
    borderRadius: 16,
    background: "var(--card)",
    border: "1px solid var(--border)",
    boxShadow: "0 30px 120px rgba(0,0,0,0.18)",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logoWrap: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18 },
  logoPlate: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    background: "var(--plate)",
    border: "1px solid var(--border)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    padding: 16,
  },
  brandTitle: { marginTop: 12, fontSize: 20, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text)" },
  brandSub: { marginTop: 4, fontSize: 13, color: "var(--muted)" },
  buttonBlock: {
    width: "100%",
    maxWidth: 500,
    textAlign: "left",
    borderRadius: 12,
    background: "var(--card)",
    border: "1px solid var(--border)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    padding: "14px 16px",
    marginBottom: 12,
    textDecoration: "none",
    color: "var(--text)",
    transition: "background .2s ease, border-color .2s ease",
    display: "block",
  },
  buttonTitle: { fontSize: 15, fontWeight: 600, letterSpacing: "-0.03em" },
  buttonSub: { marginTop: 2, fontSize: 12, color: "var(--muted)" },
  infoPanel: {
    width: "100%",
    maxWidth: 500,
    textAlign: "left",
    borderRadius: 12,
    background: "var(--cardSoft)",
    border: "1px solid var(--border)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    padding: "14px 16px",
    marginBottom: 8,
  },
  infoTitle: { fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--text)" },
  infoText: { fontSize: 12, color: "var(--muted)", lineHeight: 1.5 },
  footer: {
    width: "100%",
    maxWidth: 800,
    textAlign: "center",
    padding: "22px 0 28px",
    color: "var(--muted)",
    fontSize: 11,
    letterSpacing: "-0.02em",
  },
};

function Home() {
  return (
    <div style={s.page}>
      {/* Top brand text + theme switch */}
      <header style={s.header}>
        <div style={{ width: 140, textAlign: "left" }}>
          <ThemeToggle compact />
        </div>
        <div style={s.title}>
          <span style={{ color: "var(--text)" }}>QueCab</span>{" "}
          <span style={{ color: "var(--muted)" }}>AdbS</span>
        </div>
        <div style={{ width: 140 }} /> {/* spacer to keep title centered */}
      </header>

      <main style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoPlate}>
            <img src="/qc-logo.png" alt="QueCab AdbS Logo" style={{ width: 220, height: "auto", display: "block" }} />
          </div>
          <div style={s.brandTitle}>
            QueCab <span style={{ color: "var(--muted)" }}>AdbS</span>
          </div>
          <div style={s.brandSub}>Secure Your Load</div>
        </div>

        <a href="/join" style={s.buttonBlock}>
          <div style={s.buttonTitle}>Request Access</div>
          <div style={s.buttonSub}>Brokers / Shippers — apply for authorization</div>
        </a>

        <a href="/login" style={s.buttonBlock}>
          <div style={s.buttonTitle}>Already Authorized? Log In</div>
          <div style={s.buttonSub}>Use your QueCab AdbS code to unlock verification tools</div>
        </a>

        <div style={s.infoPanel}>
          <div style={s.infoTitle}>What is QueCab AdbS?</div>
          <div style={s.infoText}>
            QueCab AdbS is an Anti-Double Brokering System. We confirm who is actually hauling your freight,
            and we warn you when something doesn’t match at the dock.
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        Anti-Double Brokering System • Verified Carrier Authenticity • © QueCab Inc.
      </footer>
    </div>
  );
}

export default Home;
