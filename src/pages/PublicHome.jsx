import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function PublicHome() {
  const nav = useNavigate();
  const [hasAuth, setHasAuth] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adbs_auth");
      const j = raw ? JSON.parse(raw) : null;
      setHasAuth(!!j?.ok);
    } catch {
      setHasAuth(false);
    }
  }, []);

  return (
    <div style={styles.page}>
      <PublicHeader />
      <div style={styles.bg} aria-hidden="true" />

      {/* Logged-in banner (NO forced redirect) */}
      {hasAuth ? (
        <div style={styles.bannerWrap}>
          <div style={styles.banner}>
            <div style={styles.bannerLeft}>
              <div style={styles.bannerTitle}>You’re already logged in.</div>
              <div style={styles.bannerSub}>
                Continue to the Control Center or log out on this device.
              </div>
            </div>
            <div style={styles.bannerBtns}>
              <button style={styles.btnPrimarySmall} onClick={() => nav("/dashboard")}>
                Continue
              </button>
              <button
                style={styles.btnOutlineSmall}
                onClick={() => {
                  localStorage.removeItem("adbs_auth");
                  setHasAuth(false);
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.inner}>
          <div style={styles.kicker}>Anti-Double Brokering System</div>

          <h1 style={styles.h1}>Stop double brokering before the truck gets loaded.</h1>

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

          <div style={styles.micro}>Verification happens before freight moves.</div>
        </div>
      </section>

      {/* PROOF */}
      <section style={styles.proof}>
        <div style={styles.innerWide}>
          <div style={styles.sectionTitle}>Dock Verification Outcome</div>

          <div style={styles.cards}>
            <div style={{ ...styles.card, ...styles.cardClear }}>
              <div style={styles.cardTop}>
                <div style={{ ...styles.pill, ...styles.pillClear }}>CLEAR</div>
                <div style={styles.cardTitleClear}>CLEAR TO LOAD</div>
              </div>
              <div style={styles.rule} />
              <Row k="USDOT#" v="MATCHED" />
              <Row k="PLATE" v="MATCHED" />
              <Row k="DRIVER PHONE" v="CONFIRMED" />
              <div style={styles.rule} />
              <div style={styles.verdict}>All checks passed. Clear to load.</div>
              <div style={styles.foot}>Audit trail recorded.</div>
            </div>

            <div style={{ ...styles.card, ...styles.cardCaution }}>
              <div style={styles.cardTop}>
                <div style={{ ...styles.pill, ...styles.pillCaution }}>CAUTION</div>
                <div style={styles.cardTitleCaution}>DO NOT LOAD</div>
              </div>
              <div style={styles.rule} />
              <Row k="USDOT#" v="MISMATCH" bad />
              <Row k="PLATE" v="MISMATCH" bad />
              <Row k="DRIVER PHONE" v="NOT CONFIRMED" bad />
              <div style={styles.rule} />
              <div style={styles.verdict}>Verification failed. Do not release freight.</div>
              <div style={styles.foot}>Escalate before loading.</div>
            </div>
          </div>

          <div style={styles.bottomLine}>
            Verification happens <b>before</b> freight moves.
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

function Row({ k, v, bad }) {
  return (
    <div style={styles.row}>
      <div style={styles.k}>{k}</div>
      <div style={{ ...styles.v, ...(bad ? styles.vBad : null) }}>{v}</div>
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

  bannerWrap: { position: "relative", zIndex: 2, padding: "14px 20px 0" },
  banner: {
    maxWidth: 1200,
    margin: "0 auto",
    border: "1px solid rgba(140,190,255,0.18)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  bannerLeft: { minWidth: 260 },
  bannerTitle: { fontWeight: 950, letterSpacing: 0.2 },
  bannerSub: { marginTop: 4, opacity: 0.72, fontSize: 13 },
  bannerBtns: { display: "flex", gap: 10, flexWrap: "wrap" },

  btnPrimarySmall: {
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#fff",
    background: "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))",
    border: "1px solid rgba(140,190,255,0.42)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.28)",
  },
  btnOutlineSmall: {
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 950,
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.2,
    color: "#e6edf5",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.28)",
  },

  hero: { position: "relative", zIndex: 1, padding: "70px 0 40px" },
  inner: {
    maxWidth: 980,
    margin: "0 auto",
    padding: "0 20px",
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    paddingTop: 26,
    paddingBottom: 26,
  },
  innerWide: { position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 20px" },

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
    marginBottom: 12,
  },
  h1: { fontSize: 50, fontWeight: 950, letterSpacing: -0.6, margin: "0 0 12px", lineHeight: 1.04 },
  sub: { fontSize: 20, opacity: 0.82, margin: "0 0 18px", lineHeight: 1.5, maxWidth: 820 },
  ctaRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  btnPrimary: {
    padding: "16px 18px",
    fontSize: 16,
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
  micro: { marginTop: 12, fontSize: 13, opacity: 0.62 },

  proof: { position: "relative", zIndex: 1, padding: "26px 0 52px" },
  sectionTitle: {
    textAlign: "center",
    fontWeight: 950,
    letterSpacing: 0.7,
    opacity: 0.72,
    textTransform: "uppercase",
    fontSize: 13,
    marginBottom: 16,
  },
  cards: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: {
    border: "1px solid rgba(140,190,255,0.14)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 16px 34px rgba(0,0,0,0.30)",
    borderRadius: 14,
    padding: 18,
  },
  cardClear: { borderColor: "rgba(80,190,120,0.30)" },
  cardCaution: { borderColor: "rgba(255,90,90,0.30)" },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  pill: {
    padding: "7px 10px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(140,190,255,0.14)",
  },
  pillClear: { borderColor: "rgba(80,190,120,0.30)", color: "rgba(120,255,190,0.92)" },
  pillCaution: { borderColor: "rgba(255,90,90,0.30)", color: "rgba(255,140,140,0.92)" },
  cardTitleClear: { fontSize: 22, fontWeight: 950, color: "rgba(170,255,220,0.90)" },
  cardTitleCaution: { fontSize: 22, fontWeight: 950, color: "rgba(255,170,170,0.92)" },

  rule: { height: 1, background: "rgba(140,190,255,0.12)", margin: "14px 0" },
  row: { display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px dashed rgba(140,190,255,0.10)" },
  k: {
    fontSize: 12,
    opacity: 0.72,
    fontWeight: 950,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  v: {
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: 0.6,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  vBad: { color: "rgba(255,170,170,0.92)" },
  verdict: { fontSize: 15, fontWeight: 950, marginTop: 2 },
  foot: { marginTop: 6, fontSize: 13, opacity: 0.6 },
  bottomLine: { marginTop: 14, textAlign: "center", fontSize: 14, opacity: 0.75 },

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
