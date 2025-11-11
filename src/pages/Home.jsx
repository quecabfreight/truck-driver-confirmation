// /src/pages/Home.jsx — FULL OVERWRITE
import React from "react";

export default function Home() {
  return (
    <div className="qc-page">
      {/* Logo (keeps your 220px width rule) */}
      <div className="qc-logo" id="qc-logo">
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </div>

      {/* Title */}
      <h1>QueCab AdbS — Truck-Driver Confirmation</h1>

      {/* Home action links (styled as big pills by .home-links in qc-global.css) */}
      <div className="home-links">
        <a href="#/join" aria-label="Request Access">
          Request Access
        </a>
        <a href="#/login" aria-label="Already Authorized? Log In">
          Already Authorized? Log In
        </a>
        <a href="#/about" aria-label="About QueCab AdbS">
          About
        </a>
        <a href="#/checkin" aria-label="Check In Link">
          Check In Link
        </a>
      </div>
    </div>
  );
}
