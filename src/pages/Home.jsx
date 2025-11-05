import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="row-card">
        <h2>Request Access</h2>
        <p className="subtle">Brokers & Shippers only.</p>
        <div className="row-actions">
          <Link className="btn primary" to="/join">Go to /join</Link>
        </div>
      </div>

      <div className="row-card">
        <h2>Already Authorized? Log In</h2>
        <p className="subtle">Use your business email and access code.</p>
        <div className="row-actions">
          <Link className="btn primary" to="/login">Go to /login</Link>
        </div>
      </div>

      <div className="row-card">
        <h2>About</h2>
        <p className="subtle">
          QueCab AdbS — Truck-Driver confirmation built for busy docks. Realistic UI. Dark by default.
        </p>
      </div>
    </div>
  );
}
