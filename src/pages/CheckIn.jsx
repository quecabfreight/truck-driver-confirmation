// /src/pages/CheckIn.jsx — FULL OVERWRITE
import React, { useState } from "react";

export default function CheckIn() {
  const [dot, setDot] = useState("");
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    // Placeholder only: you already said back-end wiring comes later.
    alert("Verify Link generator is placeholder-only in this build.\n(USDOT: " + dot + ", Plate: " + plate + ", Phone: " + phone + ")");
  };

  return (
    <div className="qc-page">
      <div className="qc-logo" id="qc-logo">
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </div>

      <section className="panel" style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0, textAlign: "center", fontWeight: 800 }}>
          Generate AdbS Truck-Driver Verification Link
        </h1>

        <form onSubmit={handleGenerate}>
          <label htmlFor="usdot">USDOT#</label>
          <input
            id="usdot"
            type="text"
            value={dot}
            onChange={(e) => setDot(e.target.value)}
            autoComplete="off"
            inputMode="numeric"
          />

          <label htmlFor="plate">License Plate</label>
          <input
            id="plate"
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            autoComplete="off"
          />

          <label htmlFor="driverPhone">Driver Phone</label>
          <input
            id="driverPhone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button type="submit" className="primary">Generate AdbS Truck-Driver Verify Link</button>
          </div>
        </form>
      </section>
    </div>
  );
}
