import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle"; // uses your existing toggle

const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  },

  // Header: no brand text; just the theme toggle on the left
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--bg) 96%, white 4%)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },

  wrap: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  },
  shell: {
    width: "100%",
    maxWidth: 860,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 18,
    boxShadow: "0 42px 120px rgba(0,0,0,0.22)",
    padding: 26,
  },

  // Natural logo (no obvious square); soft halo only
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 8,
    position: "relative",
  },
  logoHalo: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    borderRadius: 18,
    boxShadow: "0 0 80px 12px rgba(0,0,0,0.06)",
  },
  logo: { width: 260, height: "auto", display: "block" },

  // CTA boxes
  boxes: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  boxLink: {
    display: "block",
    textDecoration: "none",
    color: "inherit",
  },
  box: {
    background: "color-mix(in oklab, var(--card) 92%, white 8%)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    boxShadow: "0 8px 26px rgba(0,0,0,0.08)",
    transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
  },
  boxHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
    borderColor: "rgba(120,130,150,0.25)",
  },
  boxTitle: { fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em" },
  boxDesc: { marginTop: 4, fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.55 },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: "0.85rem",
    color: "var(--muted)",
  },
};

export default function Home() {
  // small hover effect without CSS-in-JS libs
  const [hover1, setH1] = React.useState(false);
  const [hover2, setH2] = React.useState(false);
  const [hover3, setH3] = React.useState(false);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          {/* Light/Dark toggle visible here */}
          <ThemeToggle />
        </div>
        <div style={s.headerRight}>{/* intentionally empty (no “Secure Your Load”) */}</div>
      </div>

      <div style={s.wrap}>
        <div style={s.shell}>
          {/* Logo only (no product caption under it) */}
          <div style={s.logoWrap}>
            <div style={s.logoHalo} />
            <img src="/qc-logo.png" alt="QueCab AdbS" style={s.logo} />
          </div>

          {/* Clickable professional boxes */}
          <div style={s.boxes}>
            <Link
              to="/join"
              style={s.boxLink}
              onMouseEnter={() => setH1(true)}
              onMouseLeave={() => setH1(false)}
            >
              <div style={{ ...s.box, ...(hover1 ? s.boxHover : null) }}>
                <div style={s.boxTitle}>Request Access</div>
                <div style={s.boxDesc}>Brokers / Shippers — apply for authorization.</div>
              </div>
            </Link>

            <Link
              to="/login"
              style={s.boxLink}
              onMouseEnter={() => setH2(true)}
              onMouseLeave={() => setH2(false)}
            >
              <div style={{ ...s.box, ...(hover2 ? s.boxHover : null) }}>
                <div style={s.boxTitle}>Already Authorized? Log In</div>
                <div style={s.boxDesc}>Use your QueCab AdbS code to unlock verification tools.</div>
              </div>
            </Link>

            {/* Informational only (no link) */}
            <div
              style={{ ...s.box, ...(hover3 ? s.boxHover : null), cursor: "default" }}
              onMouseEnter={() => setH3(true)}
              onMouseLeave={() => setH3(false)}
            >
              <div style={s.boxTitle}>What is QueCab AdbS?</div>
              <div style={s.boxDesc}>
                QueCab AdbS is an Anti-Double Brokering System. We confirm who is actually hauling your freight,
                and we warn you when something doesn’t match at the dock.
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
