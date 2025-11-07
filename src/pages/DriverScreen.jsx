import React from "react";
import { useParams } from "react-router-dom";

export default function DriverScreen() {
  const { token } = useParams();

  return (
    <div className="container">
      <img
        src="/qc-logo.png"
        alt="QueCab AdbS"
        className="centered-logo"
        style={{ maxWidth: 360, height: "auto", display: "block", margin: "0 auto 18px" }}
      />

      <div className="card" style={{ maxWidth: 760 }}>
        <h2 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: "clamp(26px, 2.8vw + 14px, 42px)" }}>
          You’re checking in…
        </h2>
        <p
          className="subtle"
          style={{ marginTop: 0, marginBottom: 12, fontSize: "clamp(18px, 1.6vw + 10px, 32px)" }}
        >
          Please proceed to the dock window. Your confirmation is in progress.
        </p>

        <div className="form">
          <div className="tag">Token: {token}</div>
        </div>
      </div>
    </div>
  );
}
