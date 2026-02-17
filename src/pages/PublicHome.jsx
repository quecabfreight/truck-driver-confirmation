import React from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function PublicHome() {
  const nav = useNavigate();

  return (
    <div style={styles.page}>
      <PublicHeader />

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroGlow} aria-hidden="true" />

          <div style={styles.heroGrid}>
            <div>
              <div style={styles.kicker}>Freight Risk Control Layer</div>

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
                Built for brokers and shippers. Designed for real dock decisions.
              </div>
            </div>

            {/* Right side: quiet brand presence */}
            <div style={styles.brandPanel}>
              <div style={styles.brandBadge}>
                <img
                  src="/qc-logo.png"
                  alt="QueCab AdbS"
                  style={styles.brandLogo}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div style={{ lineHeight: 1.1 }}>
                  <div style={styles.brandName}>QueCab AdbS</div>
                  <div style={styles.brandTag}>Anti-Double Brokering System</div>
                </div>
              </div>

              <div style={styles.brandNote}>
                Verification happens before freight moves.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section style={styles.proofSection}>
        <div style={styles.sectionInner}>
          <div style={styles.sectionTitle}>Dock Verification Outcome</div>

          <div style={styles.cards}>
            {/* CLEAR */}
            <div style={{ ...styles.card, ...styles.cardClear }}>
              <div style={styles.cardTopRow}>
                <div style={{ ...styles.statusPill, ...styles.pillClear }}>CLEAR</div>
                <div style={styles.cardTitleClear}>CLEAR TO LOAD</div>
              </div>

              <div style={styles.cardDivider} />

              <div style={styles.kvRow}>
                <div style={styles.k}>USDOT#</div>
                <div style={styles.v}>MATCHED</div>
              </div>
              <div style={styles.kvRow}>
                <div style={styles.k}>PLATE</div>
                <div style={styles.v}>MATCHED</div>
              </div>
              <div style={styles.kvRow}>
                <div style={styles.k}>DRIVER PHONE</div>
                <div style={styles.v}>CONFIRMED</div>
              </div>

              <div style={styles.cardDivider} />

              <div style={styles.cardVerdict}>All checks passed. Clear to load.</div>
              <div style={styles.cardFoot}>Audit trail recorded.</div>
            </div>

            {/* CAUTION */}
            <div style={{ ...styles.card, ...styles.cardCaution }}>
              <div style={styles.cardTopRow}>
                <div style={{ ...styles.statusPill, ...styles.pillCaution }}>CAUTION</div>
                <div style={styles.cardTitleCaution}>DO NOT LOAD</div>
              </div>

              <div style={styles.cardDivider} />

              <div style={styles.kvRow}>
                <div style={styles.k}>USDOT#</div>
                <div style={{ ...styles.v, ...styles.vBad }}>MISMATCH</div>
              </div>
              <div style={styles.kvRow}>
                <div style={styles.k}>PLATE</div>
                <div style={{ ...styles.v, ...styles.vBad }}>MISMATCH</div>
              </div>
              <div style={styles.kvRow}>
                <div style={styles.k}>DRIVER PHONE</div>
                <div style={{ ...styles.v, ...styles.vBad }}>NOT CONFIRMED</div>
              </div>

              <div style={styles.cardDivider} />

              <div style={styles.cardVerdict}>
                Verification failed. Do not release freight.
              </div>
              <div style={styles.cardFoot}>Escalate before loading.</div>
            </div>
          </div>

          <div style={styles.proofBottomLine}>
            Verification happens <b>before</b> freight moves.
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (tight) */}
      <section style={styles.hiw}>
        <div style={styles.sectionInner}>
          <div style={styles.hiwTitle}>How It Works</div>

          <div style={styles.hiwGrid}>
            <Step n="1" title="Issue Verify Link" desc="Broker/shipper generates a secure link for a load." />
            <Step n="2" title="Dock Enters USDOT & Plate" desc="Check-in uses what’s visible on the truck." />
            <Step n="3" title="Driver Phone Confirmed" desc="A required phone confirmation step is recorded." />
            <Step n="4" title="System Returns Verdict" desc="CLEAR TO LOAD or CAUTION — DO NOT LOAD." />
          </div>

          <div style={styles.hiwCtas}>
            <button style={styles.btnPrimary} onClick={() => nav("/join")}>
              Request Access
            </button>
            <button style={styles.btnOutline} onClick={() => nav("/how-it-works")}>
              View Details
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.sectionInner}>
          <div style={styles.footerLine}>
            © {new Date().getFullYear()} QueCab AdbS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div style={styles.stepCard}>
      <div style={styles.stepTop}>
        <div style={styles.stepNum}>{n}</div>
        <div style={styles.stepTitle}>{title}</div>
      </div>
      <div style={styles.stepDesc}>{desc}</div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f1722",
    color: "#e6edf5",
  },

  hero: {
    position: "relative",
    padding: "84px 0 64px",
    borderBottom: "1px solid rgba(120,160,210,0.14)",
    background:
      "radial-gradient(1200px 500px at 20% 20%, rgba(60,110,180,0.20), rgba(0,0,0,0))",
  },
  heroInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(700px 300px at 70% 0%, rgba(120,180,255,0.14), rgba(0,0,0,0))",
    opacity: 0.9,
  },
  heroGrid: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 26,
    alignItems: "start",
  },
  kicker: {
    display: "inline-block",
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(120,160,210,0.22)",
    background: "rgba(0,0,0,0.22)",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 0.6,
    opacity: 0.9,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  h1: {
    fontSize: 52,
    fontWeight: 950,
    letterSpacing: -0.6,
    margin: "0 0 14px",
    lineHeight: 1.03,
  },
  sub: {
    fontSize: 20,
    opacity: 0.82,
    margin: "0 0 24px",
    lineHeight: 1.45,
    maxWidth: 640,
  },
  ctaRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  btnPrimary: {
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: 0.2,
    borderRadius: 14,
    cursor: "pointer",
    color: "#fff",
    background: "rgba(30, 90, 160, 0.75)",
    border: "1px solid rgba(120,180,255,0.45)",
    boxShadow: "0 10px 22px rgba(0,0,0,0.22)",
  },
  btnOutline: {
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: 0.2,
    borderRadius: 14,
    cursor: "pointer",
    color: "#e6edf5",
    background: "transparent",
    border: "1px solid rgba(120,180,255,0.35)",
  },
  micro: {
    marginTop: 14,
    fontSize: 13,
    opacity: 0.62,
  },

  brandPanel: {
    borderRadius: 18,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.20)",
    padding: 18,
    boxShadow: "0 12px 26px rgba(0,0,0,0.24)",
  },
  brandBadge: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(10,16,26,0.55)",
  },
  brandLogo: {
    width: 64,
    height: 64,
    objectFit: "contain",
  },
  brandName: {
    fontWeight: 950,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  brandTag: {
    marginTop: 4,
    fontSize: 13,
    opacity: 0.7,
  },
  brandNote: {
    marginTop: 14,
    fontSize: 14,
    opacity: 0.72,
    lineHeight: 1.45,
  },

  proofSection: {
    padding: "54px 0 70px",
    background: "#0c1420",
    borderBottom: "1px solid rgba(120,160,210,0.14)",
  },
  sectionInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 20px",
  },
  sectionTitle: {
    textAlign: "center",
    fontWeight: 900,
    letterSpacing: 0.3,
    opacity: 0.78,
    marginBottom: 22,
    textTransform: "uppercase",
    fontSize: 13,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  card: {
    borderRadius: 18,
    padding: 22,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.28)",
  },
  cardClear: {
    borderColor: "rgba(80,190,120,0.35)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(80,190,120,0.10) inset",
  },
  cardCaution: {
    borderColor: "rgba(255,90,90,0.35)",
    boxShadow: "0 14px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,90,90,0.10) inset",
  },
  cardTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  statusPill: {
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 0.7,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.22)",
    textTransform: "uppercase",
  },
  pillClear: {
    borderColor: "rgba(80,190,120,0.35)",
    color: "rgba(110,255,170,0.92)",
  },
  pillCaution: {
    borderColor: "rgba(255,90,90,0.35)",
    color: "rgba(255,120,120,0.92)",
  },
  cardTitleClear: {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "rgba(150,255,200,0.9)",
  },
  cardTitleCaution: {
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "rgba(255,150,150,0.92)",
  },
  cardDivider: {
    height: 1,
    background: "rgba(120,160,210,0.16)",
    margin: "16px 0",
  },
  kvRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px dashed rgba(120,160,210,0.14)",
  },
  k: {
    fontSize: 12,
    opacity: 0.72,
    fontWeight: 900,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  v: {
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: 0.6,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  vBad: {
    color: "rgba(255,170,170,0.92)",
  },
  cardVerdict: {
    fontSize: 15,
    fontWeight: 950,
    letterSpacing: 0.2,
    marginTop: 2,
  },
  cardFoot: {
    marginTop: 6,
    fontSize: 13,
    opacity: 0.6,
  },
  proofBottomLine: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.75,
  },

  hiw: {
    padding: "56px 0 72px",
    background: "#0f1722",
  },
  hiwTitle: {
    fontSize: 32,
    fontWeight: 950,
    letterSpacing: -0.3,
    margin: "0 0 18px",
  },
  hiwGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 14,
  },
  stepCard: {
    borderRadius: 16,
    border: "1px solid rgba(120,160,210,0.18)",
    background: "rgba(0,0,0,0.20)",
    padding: 16,
    boxShadow: "0 12px 24px rgba(0,0,0,0.22)",
  },
  stepTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 950,
    border: "1px solid rgba(120,160,210,0.22)",
    background: "rgba(10,16,26,0.55)",
  },
  stepTitle: {
    fontWeight: 950,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  stepDesc: {
    opacity: 0.74,
    fontSize: 13,
    lineHeight: 1.45,
  },
  hiwCtas: {
    marginTop: 18,
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  footer: {
    padding: "22px 0",
    borderTop: "1px solid rgba(120,160,210,0.14)",
    background: "#0c1420",
  },
  footerLine: {
    opacity: 0.6,
    fontSize: 13,
  },
};
