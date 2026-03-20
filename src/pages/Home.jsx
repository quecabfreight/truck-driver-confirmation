import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <img src="/qc-logo.png" style={styles.logo} />

        <div style={styles.title}>
          QueCab AdbS
        </div>

        <div style={styles.subtitle}>
          Anti-Double-Brokering System with Truck-Driver verification.
          <br />
          Built for brokers who need clean, reliable confirmation at the dock.
        </div>

        <div style={styles.section}>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Request Access</div>
            <div style={styles.cardText}>
              Beta access for brokers. Submit your business details and we’ll review.
            </div>
            <Link to="/join" style={styles.button}>
              Request Access
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Already Authorized?</div>
            <div style={styles.cardText}>
              Use your business email and access code to enter the Control Center.
            </div>
            <Link to="/login" style={styles.button}>
              Log In
            </Link>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>How It Works</div>
            <div style={styles.cardText}>
              Learn how Truck-Driver verification protects your loads at the dock.
            </div>
            <Link to="/how-it-works" style={styles.button}>
              View Process
            </Link>
          </div>

        </div>

        <div style={styles.footer}>
          QueCab AdbS — Built for brokers.
        </div>

      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0c121c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  container: {
    maxWidth: 900,
    width: "100%",
    textAlign: "center",
    color: "#e6edf5"
  },
  logo: {
    width: 220,
    marginBottom: 20
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 30
  },
  section: {
    display: "grid",
    gap: 20
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 20
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 8
  },
  cardText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16
  },
  button: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: 10,
    background: "#2a6df4",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800
  },
  footer: {
    marginTop: 30,
    fontSize: 13,
    opacity: 0.6
  }
};
