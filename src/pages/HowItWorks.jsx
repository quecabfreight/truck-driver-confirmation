import React from "react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="qc-dashboard-shell qc-shell">
      <div className="qc-dashboard-inner qc-inner">
        <div className="qc-dash-card">
          <h1 className="qc-heading" style={{ marginBottom: 10 }}>
            How It Works
          </h1>

          <ul className="qc-hiw-list" style={{ marginTop: 12 }}>
            <li>
              <strong>Request Access</strong>
              <div className="qc-sub" style={{ marginTop: 6 }}>
                Brokers & shippers submit onboarding details. We review and issue authorized access.
              </div>
            </li>

            <li style={{ marginTop: 14 }}>
              <strong>Issue a Truck-Driver Verify Link</strong>
              <div className="qc-sub" style={{ marginTop: 6 }}>
                You send the driver a secure link (driver-facing). Dock/check-in uses the verify link (dock-facing).
              </div>
            </li>

            <li style={{ marginTop: 14 }}>
              <strong>Verify Before Loading</strong>
              <div className="qc-sub" style={{ marginTop: 6 }}>
                Check-in personnel confirms what they see on the truck matches the record, and confirms the driver answered the call.
              </div>
            </li>
          </ul>

          <div className="qc-hero-actions" style={{ marginTop: 16 }}>
            <Link to="/join" className="qc-btn-primary">
              Request Access
            </Link>
            <Link to="/login" className="qc-btn-ghost">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
