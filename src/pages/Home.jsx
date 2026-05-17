import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} />

        <div style={styles.kicker}>Pre-load Truck-Driver verification</div>

        <div style={styles.title}>
          Stop double brokering before the truck gets loaded.
        </div>

        <div style={styles.subtitle}>
          QueCab AdbS™ helps brokers verify the Truck-Driver at the dock before freight is released.
        </div>

        <div style={styles.verdictBar}>
          <span>CLEAR TO LOAD</span>
          <span style={styles.divider}>|</span>
          <span>CAUTION — DO NOT LOAD</span>
        </div>

        <div style={styles.section}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Request Access</div>
            <div style={styles.cardText}>
              Broker beta access is reviewed before approval. Submit your business details to begin.
            </div>
            <Link to="/join" style={styles.button}>
              Request Access
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Already Authorized?</div>
            <div style={styles.cardText}>
              Enter with your approved business email and QueCab AdbS access code.
            </div>
            <Link to="/login" style={styles.button}>
              Log In
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>How It Works</div>
            <div style={styles.cardText}>
              See the high-level process behind real-time Truck-Driver verification at the dock.
            </div>
            <Link to="/how-it-works" style={styles.buttonSecondary}>
              View Process
            </Link>
          </div>
        </div>

        <div style={styles.note}>
          Built for brokers who need cleaner confirmation before freight moves.
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(45,95,145,0.22), transparent 34%), #0c121c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    maxWidth: 980,
    width: "100%",
    textAlign: "center",
    color: "#e6edf5",
  },

  logo: {
    width: 220,
    maxWidth: "90%",
    marginBottom: 18,
  },

  kicker: {
    display: "inline-block",
    marginBottom: 12,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(140,190,255,0.22)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(230,237,245,0.82)",
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
  },

  title: {
    maxWidth: 820,
    margin: "0 auto 12px",
    fontSize: "clamp(34px, 6vw, 56px)",
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-1.2px",
  },

  subtitle: {
    maxWidth: 720,
    margin: "0 auto 22px",
    fontSize: 18,
    opacity: 0.84,
    lineHeight: 1.5,
  },

  verdictBar: {
    display: "inline-flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 28,
    padding: "12px 18px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.13)",
    background: "rgba(0,0,0,0.22)",
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: "0.5px",
  },

  divider: {
    opacity: 0.4,
  },

  section: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },

  card: {
    background: "rgba(255,255,255,0.055)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 12px 28px rgba(0,0,0,0.24)",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 950,
    marginBottom: 9,
  },

  cardText: {
    minHeight: 62,
    fontSize: 14,
    opacity: 0.82,
    marginBottom: 18,
    lineHeight: 1.45,
  },

  button: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid rgba(140,190,255,0.42)",
    background:
      "linear-gradient(180deg, rgba(40,110,200,0.88), rgba(20,70,140,0.78))",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 900,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
  },

  buttonSecondary: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    textDecoration: "none",
    fontWeight: 900,
  },

  note: {
    marginTop: 26,
    fontSize: 13,
    opacity: 0.66,
  },
};
