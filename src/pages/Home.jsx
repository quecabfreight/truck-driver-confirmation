import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <h1>QueCab AdbS — Truck-Driver Confirmation</h1>
      <p className="muted" style={{ marginBottom: 24 }}>
        Realistic, dock-friendly UI. Big type. No gimmicks.
      </p>

      <div className="tile-row">
        <Link to="/join" className="tile">Request Access</Link>
        <Link to="/login" className="tile">Already Authorized? Log In</Link>
        <div className="tile">About</div>
      </div>
    </div>
  );
}
