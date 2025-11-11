// /src/pages/Home.jsx — FULL OVERWRITE
import React from "react";

export default function Home() {
  return (
    <div className="qc-page">
      {/* Logo (220px width via CSS; do not change) */}
      <div className="qc-logo" id="qc-logo">
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </div>

      {/* Glassy hero panel to match the app’s style */}
      <section className="panel home-hero">
        <h1>QueCab AdbS — Truck-Driver Confirmation</h1>
        <p className="home-sub">
          Secure your load — verify before you load. Instantly confirm USDOT#, carrier, and driver identity.
        </p>

        {/* Big, centered action pills */}
        <div className="home-links">
          <a href="#/join" aria-label="Request Access">Request Access</a>
          <a href="#/login" aria-label="Already Authorized? Log In">Already Authorized? Log In</a>
          <a href="#/about" aria-label="About QueCab AdbS">About</a>
          <a href="#/checkin" aria-label="Check In Link">Check In Link</a>
        </div>
      </section>
    </div>
  );
}
