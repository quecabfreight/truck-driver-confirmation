export default function Home() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
        background: "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
      }}
    >
      <div style={{ textAlign: "center", color: "white", maxWidth: "900px" }}>
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS Logo"
          style={{
            width: "260px",
            marginBottom: "30px",
            filter: "drop-shadow(0 0 14px rgba(0,0,0,0.6))",
          }}
        />

        <h1 style={{ fontSize: "42px", marginBottom: "25px" }}>
          Secure Your Load With QueCab AdbS
        </h1>

        <p
          style={{
            fontSize: "22px",
            opacity: 0.9,
            lineHeight: 1.5,
            marginBottom: "50px",
          }}
        >
          The nation’s first real-time <strong>Truck-Driver</strong> authentication system.
          Designed for brokers, shippers, and loading-dock personnel to eliminate
          double-brokering, identity fraud, and stolen loads — before they happen.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
          <a
            href="#/join"
            style={{
              padding: "16px 32px",
              background: "linear-gradient(90deg, #0ea5e9, #22d3ee)",
              borderRadius: "12px",
              fontSize: "20px",
              color: "#000",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Request Access
          </a>

          <a
            href="#/login"
            style={{
              padding: "16px 32px",
              background: "linear-gradient(90deg, #4ade80, #22c55e)",
              borderRadius: "12px",
              fontSize: "20px",
              color: "#000",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}
