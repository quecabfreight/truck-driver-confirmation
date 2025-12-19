import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="qc-hero qc-shell">
      <div className="qc-hero-overlay" />
      <div className="qc-hero-content qc-inner">
        <div className="qc-hero-text">
          <h1 className="qc-heading">
            QueCab <span className="qc-hero-line">AdbS</span>
          </h1>
          <p className="qc-sub">
            Issue secure links and verify the Truck-Driver before loading.
          </p>

          <div className="qc-hero-actions">
            <Link to="/join" className="qc-btn-primary">
              Request Access
            </Link>
            <Link to="/how-it-works" className="qc-btn-ghost">
              How It Works
            </Link>
            <Link to="/login" className="qc-btn-ghost">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
