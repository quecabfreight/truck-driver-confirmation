import React from "react";

export default function About() {
  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>About QueCab AdbS</h1>
        <p style={{ marginTop: 8 }}>
          Designed for docks of any size. Big text, clean screens, no gimmicks.
        </p>

        <h2 className="h2">What it is</h2>
        <p>Brokers &amp; Shippers helping dock staff confirm the proper trucks and drivers.</p>

        <h2 className="h2">How it works</h2>
        <ol>
          <li>Broker/Shipper generates one AdbS Truck-Driver Verification Link per shipment.</li>
          <li>Driver receives the <strong>AdbS Truck-Driver Link</strong> by text and taps it.</li>
          <li>Dock receives the <strong>AdbS Truck-Driver Verify Link</strong> by email, types what they see (USDOT# and Plate), calls the driver, then submits.</li>
        </ol>
        <p>Phone question: dock taps Y if the driver answered their call; N if not.</p>

        <h2 className="h2">Results</h2>
        <ul>
          <li>All three checks “Yes” → <strong>CLEAR TO LOAD</strong>.</li>
          <li>Any “No” → <strong>CAUTION ALERT — DO NOT LOAD</strong> (subtle red flash + alert tone). Alerts go to the Broker/Shipper only.</li>
        </ul>
      </div>
    </div>
  );
}
