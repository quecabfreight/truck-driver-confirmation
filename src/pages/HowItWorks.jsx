import React from "react";

export default function HowItWorks() {
  return (
    <div className="qc-shell" style={{ padding: 0 }}>
      <section
        style={{
          width: "100%",
          maxWidth: "none",

          // Show the FULL image, not a cropped top portion
          backgroundImage: "url(/bg-howitworks.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",

          // 🔥 Make the banner tall enough to reveal the entire graphic
          minHeight: "700px",   // ← THIS fixes the missing bottom half

          display: "flex",
          alignItems: "flex-start",
          paddingTop: "60px",
        }}
      >
        <div className="qc-hero-inner" style={{ paddingLeft: "40px" }}>
          <h1 className="qc-heading">How QueCab AdbS Works</h1>
          <p className="qc-sub">
            3 Questions. 1 Link. Instant clearance. No apps. No downloads. Just answers.
          </p>

          <div className="qc-how-steps">
            <p>☐ What&apos;s the USDOT# on the truck?</p>
            <p>☐ What&apos;s the license plate number?</p>
            <p>☐ Did the driver answer their registered phone?</p>
            <p>
              ✓ Correct = Cleared to Load &nbsp;&nbsp; ✖ Mismatch = Alert Sent. Load Blocked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
