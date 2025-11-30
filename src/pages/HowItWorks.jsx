import React from "react";

export default function HowItWorks() {
  const heroStyle = {
    minHeight: "420px",
    backgroundImage: 'url("/bg-howitworks.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "contain",          // ✅ show the whole image
    backgroundColor: "#050816",         // dark fill behind/around it
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "3rem 6vw 3.5rem",
  };

  const cardStyle = {
    maxWidth: "680px",
    background: "linear-gradient(135deg, rgba(5,8,22,0.9), rgba(5,8,22,0.6))",
    padding: "2.25rem 2.75rem",
    borderRadius: "18px",
    boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: "1.5rem 0 1.25rem",
    lineHeight: 1.6,
    fontSize: "1rem",
  };

  const listItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.25rem",
  };

  const checkStyle = {
    width: "0.9rem",
    height: "0.9rem",
    borderRadius: "3px",
  };

  const footnoteStyle = {
    marginTop: "0.75rem",
    fontSize: "0.95rem",
    fontWeight: 500,
  };

  return (
    <div className="qc-shell">
      <main style={heroStyle}>
        <div style={cardStyle}>
          <h1 className="qc-heading">How QueCab AdbS Works</h1>
          <p className="qc-sub">
            3 Questions. 1 Link. Instant clearance. No apps. No downloads. Just
            answers.
          </p>

          <ul style={listStyle}>
            <li style={listItemStyle}>
              <input type="checkbox" disabled style={checkStyle} />
              <span>What&apos;s the USDOT# on the truck?</span>
            </li>
            <li style={listItemStyle}>
              <input type="checkbox" disabled style={checkStyle} />
              <span>What&apos;s the license plate number?</span>
            </li>
            <li style={listItemStyle}>
              <input type="checkbox" disabled style={checkStyle} />
              <span>Did the driver answer their registered phone?</span>
            </li>
          </ul>

          <p style={footnoteStyle}>
            ✓ Correct = Cleared to Load &nbsp;&nbsp; ✗ Mismatch = Alert Sent.
            Load Blocked.
          </p>
        </div>
      </main>
    </div>
  );
}
