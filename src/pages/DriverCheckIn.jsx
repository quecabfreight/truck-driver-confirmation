import React from "react";
import { useParams } from "react-router-dom";

export default function DriverCheckIn() {
  const { token } = useParams();
  const tokenShort = (token || "").slice(0, 12);
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <img src="/qc-logo.png" alt="QueCab AdbS" className="centered-logo" />
      <h2 style={{ marginTop: 6, marginBottom: 8 }}>You’re checking in…</h2>
      <p className="subtle">Token: <code>{tokenShort || "—"}</code></p>
      <p>Please proceed to the dock window. Your Truck-Driver verification will be completed by staff.</p>
    </div>
  );
}
