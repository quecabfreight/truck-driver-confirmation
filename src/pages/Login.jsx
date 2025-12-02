export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo behavior for now
    alert(
      "Demo only – in the live system this would open the QueCab AdbS Control Center."
    );
  };

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
      <div
        style={{
          background: "#020617",
          padding: "40px",
          borderRadius: "18px",
          width: "480px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
          color: "white",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "26px",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{
              width: "260px",
              height: "auto",
            }}
          />
        </div>

        {/* HEADING */}
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Log In
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "24px",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          For authorized brokers and shippers using QueCab AdbS.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* BUSINESS EMAIL */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontSize: "18px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Business Email
            </label>
            <input
              type="email"
              required
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
              style={{
                fontSize: "18px",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Access Code
            </label>
            <input
              type="text"
              required
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
          <div
            style={{
              marginBottom: "22px",
              fontSize: "16px",
            }}
          >
            <label>
              <input type="checkbox" style={{ marginRight: "8px" }} />
              Remember this device
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "20px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #0ea5e9, #22c55e, #0ea5e9)",
              color: "#0b1120",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Log In (Demo)
          </button>
        </form>

        {/* DEMO NOTICE BAR */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "16px",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "rgba(22, 163, 74, 0.2)",
            border: "1px solid rgba(74, 222, 128, 0.8)",
            color: "#bbf7d0",
            textAlign: "center",
          }}
        >
          Demo only – in production this login opens the QueCab AdbS Control
          Center.
        </div>
      </div>
    </div>
  );
}
