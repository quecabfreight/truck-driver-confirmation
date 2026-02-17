import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PublicHeader() {
  const nav = useNavigate();
  const loc = useLocation();
  const active = (path) => loc.pathname === path;

  return (
    <div style={styles.wrap}>
      {/* steel texture + light sweep */}
      <div style={styles.bg} aria-hidden="true" />
      <div style={styles.inner}>
        <div style={styles.brand} onClick={() => nav("/")}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={styles.logo}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div style={{ lineHeight: 1.05 }}>
            <div style={styles.title}>QueCab AdbS</div>
            <div style={styles.sub}>Anti-Double Brokering System</div>
            <div style={styles.sub2}>Verification happens before freight moves.</div>
          </div>
        </div>

        <div style={styles.nav}>
          <NavBtn text="Home" onClick={() => nav("/")} active={active("/")} />
          <NavBtn
            text="How It Works"
            onClick={() => nav("/how-it-works")}
            active={active("/how-it-works")}
          />
          <NavBtn text="About" onClick={() => nav("/about")} active={active("/about")} />
          <button onClick={() => nav("/login")} style={styles.btnOutline}>
            Log In
          </button>
          <button onClick={() => nav("/join")} style={styles.btnPrimary}>
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ text, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 12px",
        fontSize: 15,
        fontWeight: 900,
        borderRadius: 10, // less “pill”
        cursor: "pointer",
        letterSpacing: 0.2,
        background: active ? "rgba(140,190,255,0.10)" : "rgba(0,0,0,0.18)",
        border: active
          ? "1px solid rgba(140,190,255,0.38)"
          : "1px solid rgba(120,160,210,0.20)",
        color: "rgba(230,237,245,0.92)",
      }}
    >
      {text}
    </button>
  );
}

const styles = {
  wrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    borderBottom: "1px solid rgba(140,190,255,0.16)",
    background: "rgba(10,14,22,0.76)",
    backdropFilter: "blur(10px)",
  },
  bg: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.55,
    background: [
      "radial-gradient(900px 260px at 20% 0%, rgba(120,180,255,0.20), rgba(0,0,0,0))",
      "radial-gradient(700px 220px at 80% 0%, rgba(255,255,255,0.07), rgba(0,0,0,0))",
      steelNoise(),
    ].join(", "),
  },
  inner: {
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    userSelect: "none",
  },
  logo: { width: 60, height: 60, objectFit: "contain" },
  title: { fontWeight: 950, letterSpacing: 0.3, fontSize: 16 },
  sub: { opacity: 0.74, fontSize: 13, marginTop: 2 },
  sub2: { opacity: 0.58, fontSize: 12, marginTop: 3 },
  nav: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },

  btnPrimary: {
    padding: "12px 14px",
    fontSize: 15,
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
    padding: "12px 14px",
    fontSize: 15,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#e6edf5",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.28)",
  },
};

function steelNoise() {
  // Tiny inline SVG noise for “steel grain” (no external assets needed)
  const svg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.40
        0 0 0 0 0.55
        0 0 0 0 0.75
        0 0 0 0.10 0"/>
    </filter>
    <rect width="180" height="180" filter="url(#n)" opacity="0.45"/>
  </svg>`);
  return `url("data:image/svg+xml,${svg}")`;
}
