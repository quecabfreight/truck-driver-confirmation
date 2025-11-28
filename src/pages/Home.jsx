import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="qc-shell qc-hero">
      <div className="qc-hero-overlay"></div>
      <div className="qc-inner qc-hero-content">
        <div className="qc-hero-text">
          <h1 className="qc-heading">
            1 LINK.
            <br />
            3 CHECKS.
            <br />
            <span className="qc-hero-line">INSTANT VERIFICATION.</span>
          </h1>

          <p className="qc-sub">
            Secure your load - verify before you load. Instantly confirm the
            Truck-Driver unit (truck plus driver) against the broker or
            shipper&apos;s record right at the dock.
          </p>

          <div className="qc-hero-actions">
            <Link to="/join" className="qc-btn-primary">
              Request Access
            </Link>
            <Link to="/login" className="qc-btn-ghost">
              Already Authorized? Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
