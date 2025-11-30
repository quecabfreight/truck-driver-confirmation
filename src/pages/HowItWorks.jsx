import React from "react";

export default function HowItWorks() {
  return (
    <div className="qc-shell">
      <section
        className="qc-hero qc-hero-howitworks"
        style={{
          // Make sure the whole image shows, not just the top half
          backgroundImage: "url(/bg-howitworks.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          minHeight: "360px", // tall enough to show the trucks + logo
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="qc-hero-inner">
          <h1 className="qc-heading">How QueCab AdbS Works</h1>
          <p className="qc-sub">
            3 Questions. 1 Link. Instant clearance. No apps. No downloads. Just
            answers.
          </p>

          <div className="qc-how-steps">
            <p>
              <span>☐</span> What’s the USDOT# on the truck?
            </p>
            <p>
              <span>☐</span> What’s the license plate number?
            </p>
            <p>
              <span>☐</span> Did the driver answer their registered phone?
            </p>
            <p>
              ✓ Correct = Cleared to Load &nbsp;&nbsp; ✖ Mismatch = Alert Sent.
              Load Blocked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
