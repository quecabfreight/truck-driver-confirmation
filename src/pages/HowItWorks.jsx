import React from "react";

export default function HowItWorks() {
  return (
    <div className="qc-shell" style={{ padding: 0 }}>
      <section
        style={{
          width: "100%",
          maxWidth: "none",

          // Use the correct hero image
          backgroundImage: "url(/bg-howitworks.jpg)",

          // ✅ Show the whole image instead of zoom/crop
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",

          // ✅ Reasonable height so it’s NOT huge
          minHeight: "460px",

          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",

          // keep the content away from the left edge
          paddingTop: "40px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <div className="qc-hero-inner">
          <h1 className="qc-heading">How QueCab AdbS Works</h1>
          <p className="qc-sub">
            3 Questions. 1 Link. Instant clearance. No apps. No downloads. Just
            answers.
          </p>

          <div className="qc-how-steps">
            <p>☐ What&apos;s the USDOT# on the truck?</p>
            <p>☐ What&apos;s the license plate number?</p>
            <p>☐ Did the driver answer their registered phone?</p>
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
