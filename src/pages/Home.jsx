// /src/pages/Home.jsx — FULL OVERWRITE (match other pages' look)
import React from "react";

export default function Home() {
  return (
    <div className="qc-page">
      {/* Logo (keeps 220px rule) */}
      <div className="qc-logo" id="qc-logo">
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </div>

      {/* Hero panel to match other pages' card/glass look */}
      <section className="panel home-panel">
        <h1>QueCab AdbS — Truck-Driver Confirmation</h1>

        {/* Big, centered action links */}
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
      </section>
    </div>
  );
}
