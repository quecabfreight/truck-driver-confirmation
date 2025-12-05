import React from "react";
import "./index.css";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "32px",
      }}
    >
      <div>
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS Logo"
          style={{
            width: "260px",
            height: "auto",
            marginBottom: "24px",
            filter: "drop-shadow(0 0 14px rgba(0,0,0,0.6))",
          }}
        />
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          QueCab AdbS Frontend is Online
        </h1>
        <p style={{ fontSize: "20px", opacity: 0.9 }}>
          This is a temporary sanity screen so we can stabilize routing.
          <br />
          If you can see this, the app is building and React is mounting
          correctly.
        </p>
      </div>
    </div>
  );
}
