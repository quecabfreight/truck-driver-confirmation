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
              A secure, real-time verification system that confirms the <strong>Truck-Driver</strong> (truck and driver pair) before loading. 
              Designed for busy docks with large, easy-to-read screens.
            </p>
          </div>

          <div>
            <h2 className="h2">Who it’s for</h2>
            <p>
              Brokers &amp; Shippers helping dock staff confirm the proper trucks and drivers.
            </p>
          </div>

          <div>
            <h2 className="h2">How it works</h2>
            <p>
              A Broker issues an <strong>AdbS Truck-Driver Verify Link</strong> for each shipment. 
              The driver opens the driver link; dock staff open the dock link. 
              At the dock, two questions confirm legitimacy:
              <br /><br />
              • Does the USDOT# on the truck match? <br />
              • Did the driver answer their phone when called? <br /><br />
              If both answers are “Yes,” the system displays <strong>Clear to Load</strong>. 
              Otherwise, a professional <strong>Caution Alert – Do Not Load</strong> appears with a subtle red flash and alert tone.
            </p>
          </div>

          <div>
            <h2 className="h2">Privacy & Authenticity</h2>
            <p>
              The driver link conceals identifying data such as USDOT# and plate number. 
              Verification happens only on the dock side, matching what’s entered against the broker or shipper’s record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
