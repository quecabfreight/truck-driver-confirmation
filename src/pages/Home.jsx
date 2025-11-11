// /src/pages/Home.jsx — FULL OVERWRITE (glassy + centered, matches others)
import React from "react";

export default function Home() {
  return (
    <div className="qc-page">
      <div className="qc-logo" id="qc-logo">
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </div>

      <section className="panel" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ marginTop: 0, fontWeight: 800 }}>
          QueCab AdbS — Truck-Driver Confirmation
        </h1>
        <p style={{ margin: "0 auto 18px", maxWidth: 820, fontWeight: 600 }}>
          Secure your load — verify before you load. Instantly confirm USDOT#, carrier, and driver identity.
        </p>

        <div className="home-links" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <a href="#/join" aria-label="Request Access">Request Access</a>
          <a href="#/login" aria-label="Already Authorized? Log In">Already Authorized? Log In</a>
          <a href="#/about" aria-label="About QueCab AdbS">About</a>
          <a href="#/checkin" aria-label="Check In Link">Check In Link</a>
        </div>
      </section>
    </div>
  );
}
