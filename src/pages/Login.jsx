import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedCode = String(accessCode || "").trim().toUpperCase();

    if (normalizedCode === "DEMO123") {
      if (rememberDevice) {
        localStorage.setItem(
          "adbsv1_demoAuth",
          JSON.stringify({
            email,
            ts: Date.now(),
          })
        );
      } else {
        localStorage.removeItem("adbsv1_demoAuth");
      }

      navigate("/control-center");
    } else {
      setError("Demo login failed. Use access code DEMO123 with any business email.");
    }
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

        {/* ERROR BANNER */}
        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.7)",
              color: "#fecaca",
              padding: "10px 14px",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
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
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              Remember this device
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Log In (Demo – use DEMO123)
          </button>
        </form>

        {/* FOOTER NOTE */}
        <div
          style={{
            marginTop: "18px",
            fontSize: "13px",
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Demo only – in production this login opens the QueCab AdbS Control Center.
        </div>
      </div>
    </div>
  );
}
