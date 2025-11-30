import React from "react";

export default function HowItWorks() {
  return (
    <div className="qc-shell">
      <section
        className="qc-hero qc-hero-howitworks"
        style={{
          // BREAK OUT of any max-width so the hero spans the full viewport
          maxWidth: "none",
          width: "100%",

          // Make the dock image fill the banner
          backgroundImage: "url(/bg-howitworks.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",

          // Give it enough height to show the full scene
          minHeight: "420px",

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
              <span>☐</span> What&apos;s the USDOT# on the truck?
            </p>
            <p>
              <span>☐</span> What&apos;s the license plate number?
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
