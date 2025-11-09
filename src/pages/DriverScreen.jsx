import React from "react";

export default function DriverScreen() {
  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>You’re checking in…</h1>
        <p className="muted">AdbS Truck-Driver Link</p>
        {/* Token deliberately not shown. URL carries it, UI doesn’t. */}
      </div>
    </div>
  );
}
