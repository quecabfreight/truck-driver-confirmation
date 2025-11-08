import React from "react";
import { useParams } from "react-router-dom";

export default function DriverScreen() {
  const { token } = useParams();
  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>You’re checking in…</h1>
        <p className="muted">AdbS Truck-Driver Verify Link</p>
        <p className="muted" style={{ marginTop: 8 }}>Token: {token}</p>
      </div>
    </div>
  );
}
