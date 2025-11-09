import React from "react";

export default function About() {
  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>About QueCab AdbS</h1>
        <p className="muted" style={{marginBottom: 16}}>
          AdbS = Anti-Double Brokering System
        </p>

        <div style={{display:"grid", gap:14}}>
          <div>
            <h2 className="h2">What it is</h2>
            <p>
              A simple, high-visibility workflow to confirm the <strong>Truck-Driver</strong> (truck + driver) before loading.
              Built for busy docks — big text, clean screens, no gimmicks.
            </p>
          </div>

          <div>
            <h2 className="h2">Who it’s for</h2>
            <p>Brokers &amp; shippers issuing verification links. Dock staff checking trucks in.</p>
          </div>

          <div>
            <h2 className="h2">How it works</h2>
            <p>
              Broker issues an <strong>AdbS Verification Link</strong>. Driver opens the driver link; dock opens the dock link.
              Dock confirms two items: <strong>USDOT matches</strong> and <strong>driver answered the phone</strong>.
              If both are Yes → <strong>Clear to Load</strong>. Otherwise → <strong>Caution Alert — Do Not Load</strong>.
            </p>
          </div>

          <div>
            <h2 className="h2">Phase 2 (coming)</h2>
            <p>
              Dock enters what they <em>see on the truck</em> for USDOT# and plate. System matches the broker/shipper record.
              Case-insensitive checks. Same PIN gate. Same simple screens.
            </p>
          </div>

          <div>
            <h2 className="h2">Privacy & Authenticity</h2>
            <p>
              The driver link doesn’t expose backend identifiers. Verification happens on the dock side against the broker/shipper’s data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
