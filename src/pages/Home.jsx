import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ maxWidth: 980, margin: "40px auto 60px", padding: "0 16px" }}>
      {/* Top-center logo (no distortion) */}
      <img
        src="/qc-logo.png"
        alt="QueCab AdbS"
        className="page-logo"
        style={{ maxWidth: 260, height: "auto", display: "block", margin: "0 auto 18px" }}
      />

      {/* Three rows */}
      <section className="card" style={{ marginBottom: 18 }}>
        <div className="card-title">Request Access</div>
        <div className="small">Brokers &amp; Shippers only.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/join" className="btn">Go to /join</Link>
        </div>
      </section>

      <section className="card" style={{ marginBottom: 18 }}>
        <div className="card-title">Already Authorized? Log In</div>
        <div className="card-subtitle">Use your business email and access code.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/login" className="btn">Go to /login</Link>
        </div>
      </section>

      <section className="card">
        <div className="card-title">About</div>
        <div className="about-text">
          QueCab AdbS — Truck-Driver confirmation built for busy docks.
        </div>
      </section>
    </main>
  );
}
