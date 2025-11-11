// /src/pages/Home.jsx — INLINE XL STYLES (no CSS dependency)
import React from "react";

const XL = {
  base:  { fontSize: "60px", lineHeight: 1.25, color: "inherit" },
  h1:    { fontSize: "69px", lineHeight: 1.2, fontWeight: 800, margin: "0 0 12px", textAlign: "center" },
  sub:   { fontSize: "60px", lineHeight: 1.25, fontWeight: 600, margin: "0 auto 18px", maxWidth: "860px", textAlign: "center" },
  btn:   {
    fontSize: "60px", lineHeight: 1.25, fontWeight: 800,
    minHeight: "80px", padding: "0 28px",
    textDecoration: "none", color: "inherit",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    borderRadius: "14px", border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(17,17,19,0.6)",
  },
  stack: { display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" },
  panel: { maxWidth: "900px", margin: "0 auto", textAlign: "center" },
  logo:  { display: "block", width: "220px", maxWidth: "90vw", margin: "24px auto" }
};

export default function Home() {
  return (
    <div style={XL.base}>
      <div style={XL.logo}>
        <img src="/qc-logo.png" alt="QueCab AdbS logo" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      <section style={XL.panel}>
        <h1 style={XL.h1}>QueCab AdbS — Truck-Driver Confirmation</h1>
        <p style={XL.sub}>
          Secure your load — verify before you load. Instantly confirm USDOT#, carrier, and driver identity.
        </p>

        <div style={XL.stack}>
          <a href="#/join"  style={XL.btn}>Request Access</a>
          <a href="#/login" style={XL.btn}>Already Authorized? Log In</a>
          <a href="#/about" style={XL.btn}>About</a>
          <a href="#/checkin" style={XL.btn}>Check In Link</a>
        </div>
      </section>
    </div>
  );
}
