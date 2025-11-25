import React from "react";

export default function HowItWorks() {
  return (
    <div className="qc-shell qc-hiw">
      <div className="qc-hiw-overlay" />
      <div className="qc-inner qc-hiw-content">
        <h1 className="qc-heading">How QueCab AdbS Works</h1>
        <p className="qc-sub">
          3 Questions. 1 Link. Instant clearance. No apps. No downloads. Just
          answers.
        </p>

        <ul className="qc-hiw-list">
          <li>What&apos;s the USDOT# on the truck?</li>
          <li>What&apos;s the license plate number?</li>
          <li>Did the driver answer their registered phone?</li>
        </ul>

        <p className="qc-sub qc-hiw-result">
          ✔ Correct = Cleared to Load &nbsp;&nbsp; ✖ Mismatch = Alert Sent. Load
          Blocked.
        </p>
      </div>
    </div>
  );
}
