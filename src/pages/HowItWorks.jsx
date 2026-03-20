import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <div style={styles.title}>How It Works</div>

        <div style={styles.subtitle}>
          Issue a verification link → the driver presents it at check-in → dock personnel
          enter the USDOT# and plate they see on the truck, place the driver call, then submit.
          If everything matches, the Truck-Driver is CLEAR TO LOAD. If anything is off, it’s a
          CAUTION ALERT — DO NOT LOAD.
        </div>

        <div style={styles.steps}>

          <div style={styles.card}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.cardTitle}>Issue</div>
            <div style={styles.cardText}>
              Broker issues one AdbS verification per load. The Load ID ties everything together.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.cardTitle}>Verify</div>
            <div style={styles.cardText}>
              Dock enters what they physically see on the truck (USDOT# and plate) and completes the driver call step.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.cardTitle}>Decide</div>
            <div style={styles.cardText}>
              System returns a clear verdict: CLEAR TO LOAD or CAUTION ALERT — DO NOT LOAD.
            </div>
          </div>

        </div>

        <Link to="/join" style={styles.button}>
          Request Access
        </Link>

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
    maxWidth: 800,
    width: "100%",
    textAlign: "center",
    color: "#e6edf5"
  },
  title: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 16
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.85,
    marginBottom: 30,
    lineHeight: 1.5
  },
  steps: {
    display: "grid",
    gap: 20,
    marginBottom: 30
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 20,
    textAlign: "left"
  },
  stepNumber: {
    fontSize: 22,
    fontWeight: 900,
    marginBottom: 6,
    color: "#6fa8ff"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 6
  },
  cardText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 1.5
  },
  button: {
    display: "inline-block",
    padding: "12px 22px",
    borderRadius: 10,
    background: "#2a6df4",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800
  }
};
