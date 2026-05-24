import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.overlay} />

      <div style={styles.container}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} />

        <div style={styles.heroTitle}>
          Stop double brokering before the truck gets loaded.
        </div>

        <div style={styles.heroSub}>
          QueCab AdbS™ helps brokers verify the Truck-Driver at the dock before freight is released.
        </div>

        <div style={styles.heroResultWrap}>
          <div style={styles.clearBox}>
            CLEAR TO LOAD
          </div>

          <div style={styles.divider}>|</div>

          <div style={styles.cautionBox}>
            CAUTION — DO NOT LOAD
          </div>
        </div>

        <div style={styles.sectionGrid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              Request Access
            </div>

            <div style={styles.cardText}>
              Broker beta access is reviewed before approval. Submit your business details to begin.
            </div>

            <Link to="/join" style={styles.primaryBtn}>
              Request Access
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              Already Authorized?
            </div>

            <div style={styles.cardText}>
              Enter with your approved business email and QueCab AdbS access code.
            </div>

            <Link to="/login" style={styles.primaryBtn}>
              Log In
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              How It Works
            </div>

            <div style={styles.cardText}>
              See the high-level process behind real-time Truck-Driver verification at the dock.
            </div>

            <Link to="/how-it-works" style={styles.primaryBtn}>
              View Process
            </Link>
          </div>
        </div>

        <div style={styles.pricingWrap}>
          <div style={styles.pricingTitle}>
            Founding Beta Access
          </div>

          <div style={styles.betaPrice}>
            $49/month during beta
          </div>

          <div style={styles.betaText}>
            • Unlimited Truck-Driver verifications during beta
            <br />
            • Founding-user pricing
            <br />
            • Early feature access
            <br />
            • Direct founder support
          </div>

          <div style={styles.futurePricing}>
            Future pricing begins at $149/month.
          </div>

          <div style={styles.tierGrid}>
            <div style={styles.tierCard}>
              <div style={styles.tierName}>Starter</div>
              <div style={styles.tierPrice}>$149/month</div>
              <div style={styles.tierDesc}>
                Up to 100 verifications
              </div>
            </div>

            <div style={styles.tierCard}>
              <div style={styles.tierName}>Growth</div>
              <div style={styles.tierPrice}>$249/month</div>
              <div style={styles.tierDesc}>
                Up to 250 verifications
              </div>
            </div>

            <div style={styles.tierCard}>
              <div style={styles.tierName}>Pro</div>
              <div style={styles.tierPrice}>$399/month</div>
              <div style={styles.tierDesc}>
                Up to 500 verifications
              </div>
            </div>

            <div style={styles.tierCard}>
              <div style={styles.tierName}>Scale</div>
              <div style={styles.tierPrice}>$599/month</div>
              <div style={styles.tierDesc}>
                Up to 1,000 verifications
              </div>
            </div>

            <div style={styles.tierCard}>
              <div style={styles.tierName}>Enterprise</div>
              <div style={styles.tierPrice}>Custom</div>
              <div style={styles.tierDesc}>
                High-volume broker operations
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footerText}>
          QueCab AdbS™ — Verification happens before freight moves.
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0a1018 0%, #0f1724 55%, #121d2d 100%)",
    overflow: "hidden",
    padding: "40px 18px 80px"
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(60,120,220,0.14), transparent 40%)"
  },

  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1180,
    margin: "0 auto",
    color: "#ffffff"
  },

  logo: {
    width: 220,
    maxWidth: "92%",
    display: "block",
    margin: "30px auto 20px"
  },

  heroTitle: {
    textAlign: "center",
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.1,
    maxWidth: 900,
    margin: "0 auto"
  },

  heroSub: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 18,
    lineHeight: 1.6,
    color: "#c8d4e6",
    maxWidth: 860,
    marginLeft: "auto",
    marginRight: "auto"
  },

  heroResultWrap: {
    marginTop: 34,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap"
  },

  clearBox: {
    padding: "16px 26px",
    borderRadius: 14,
    border: "1px solid rgba(90,220,130,0.45)",
    background: "rgba(20,90,40,0.34)",
    fontWeight: 900,
    fontSize: 20
  },

  cautionBox: {
    padding: "16px 26px",
    borderRadius: 14,
    border: "1px solid rgba(255,90,90,0.45)",
    background: "rgba(110,25,25,0.34)",
    fontWeight: 900,
    fontSize: 20
  },

  divider: {
    fontSize: 28,
    opacity: 0.6,
    fontWeight: 900
  },

  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
    marginTop: 44
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 18,
    padding: 24,
    backdropFilter: "blur(8px)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.28)"
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 10
  },

  cardText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#d6dfeb",
    marginBottom: 18
  },

  primaryBtn: {
    display: "inline-block",
    padding: "13px 22px",
    borderRadius: 12,
    background: "rgba(40,110,190,0.42)",
    border: "1px solid rgba(120,180,255,0.5)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 15
  },

  pricingWrap: {
    marginTop: 60,
    padding: 28,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.30)"
  },

  pricingTitle: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: 900
  },

  betaPrice: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: 900,
    marginTop: 10,
    color: "#8fc7ff"
  },

  betaText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 1.9,
    color: "#d5e1f0"
  },

  futurePricing: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 800,
    color: "#ffffff"
  },

  tierGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
    marginTop: 34
  },

  tierCard: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    padding: 22,
    textAlign: "center"
  },

  tierName: {
    fontSize: 22,
    fontWeight: 900
  },

  tierPrice: {
    fontSize: 28,
    fontWeight: 900,
    marginTop: 12,
    color: "#8fc7ff"
  },

  tierDesc: {
    marginTop: 12,
    color: "#d2dceb",
    lineHeight: 1.5
  },

  footerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#b9c7da"
  }
};
