import React from "react";

export default function ControlCenter() {
  return (
    <div className="qc-shell qc-dashboard-shell">
      <div className="qc-inner qc-dashboard-inner">
        <div className="qc-dash-header">
          <h1 className="qc-heading">AdbS Control Center</h1>
          <p className="qc-sub">
            Demo view. In the live system this is where you’ll issue AdbS
            Truck-Driver Verify Links, monitor active loads, and see recent
            Truck-Driver verifications.
          </p>
        </div>

        <div className="qc-dash-grid">
          {/* LEFT – Issue link */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Issue AdbS Verification Link</h2>
            <p className="qc-dash-text">
              Create a unique AdbS verification link for a specific load. The
              link will be sent to your chosen contact, and used at the dock to
              verify the Truck-Driver unit before loading.
            </p>

            <ul className="qc-dash-list">
              <li>Specify carrier / Truck-Driver details</li>
              <li>Choose how to send the link (email / text)</li>
              <li>Set start / end dates for link validity</li>
            </ul>

            <div className="qc-dash-actions">
              <button className="qc-btn-primary">Issue New Link</button>
            </div>
          </section>

          {/* MIDDLE – Active links */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Active Verify Links</h2>
            <p className="qc-dash-text">
              In the full build, this panel shows all open AdbS
              Truck-Driver Verify Links that haven’t been cleared or cancelled
              yet.
            </p>

            <div className="qc-dash-empty">
              No active links in this demo.
            </div>
          </section>

          {/* RIGHT – Recent checks */}
          <section className="qc-dash-card">
            <h2 className="qc-dash-title">Recent Truck-Driver Checks</h2>
            <p className="qc-dash-text">
              This panel will list recent dock-side checks, including whether
              USDOT and plate matched and if the driver answered their
              registered phone.
            </p>

            <div className="qc-dash-empty">
              No recent checks in this demo.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
