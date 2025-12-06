import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "780px",
          textAlign: "center",
          padding: "40px 32px 46px",
          background: "#020617",
          borderRadius: "20px",
          border: "1px solid rgba(148,163,184,0.5)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
        }}
      >
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS Logo"
          style={{
            width: "110px",
            height: "110px",
            objectFit: "contain",
            marginBottom: "18px",
          }}
        />
        <h1 style={{ fontSize: "30px", marginBottom: "10px" }}>
          Secure Your Load With QueCab AdbS
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            marginBottom: "26px",
          }}
        >
          The nation&apos;s first real-time <strong>Truck-Driver</strong>{" "}
          authentication system. Designed for brokers, shippers, and loading-dock
          personnel to kill double-brokering and identity fraud before it
          reaches the dock.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginBottom: "18px",
          }}
        >
          <Link to="/join">
            <button
              type="button"
              style={{
                padding: "14px 26px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
              }}
            >
              Request Access
            </button>
          </Link>

          <Link to="/login">
            <button
              type="button"
              style={{
                padding: "14px 26px",
                borderRadius: "999px",
                border: "1px solid #38bdf8",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                background: "transparent",
                color: "white",
              }}
            >
              Log In
            </button>
          </Link>
        </div>

        <p
          style={{
            fontSize: "14px",
            opacity: 0.8,
          }}
        >
          Demo environment only – production version connects to live QueCab
          AdbS control lanes.
        </p>
      </div>
    </div>
  );
}
