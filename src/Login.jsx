export default function Login() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "40px",
          borderRadius: "16px",
          width: "460px",
          border: "1px solid rgba(148,163,184,0.6)",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab Logo"
            style={{ width: "260px", height: "auto" }}
          />
        </div>

        {/* HEADING */}
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Log In
        </h1>

        {/* EMAIL */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontSize: "18px", display: "block", marginBottom: "6px" }}
          >
            Business Email
          </label>
          <input
            type="email"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "1px solid #64748b",
              background: "#0f172a",
              color: "white",
            }}
          />
        </div>

        {/* ACCESS CODE */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontSize: "18px", display: "block", marginBottom: "6px" }}
          >
            Access Code
          </label>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "1px solid #64748b",
              background: "#0f172a",
              color: "white",
            }}
          />
        </div>

        {/* REMEMBER DEVICE */}
        <div style={{ marginBottom: "20px", fontSize: "16px" }}>
          <label>
            <input type="checkbox" style={{ marginRight: "8px" }} />
            Remember this device
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "20px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #0ea5e9, #22c55e, #0ea5e9)",
            color: "#0b1120",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Log In (Demo)
        </button>

        {/* DEMO FOOTER */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "16px",
            color: "#4ade80",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Demo Only – In production this opens AdbS Control Center
        </div>
      </div>
    </div>
  );
}
