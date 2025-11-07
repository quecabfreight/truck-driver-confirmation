import React, { useState } from "react";

function randomToken(len = 10) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnpqrstuvwxyz";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export default function SmartLink() {
  const [token, setToken] = useState("");
  const [usdot, setUsdot] = useState("");
  const [plate, setPlate] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const issueLink = () => {
    // demo: make a token; later we’ll persist + include usdot/plate/phone server-side
    setToken(randomToken(10));
  };

  const driverURL = token ? `${window.location.origin}/#/s/${token}` : "";
  const dockURL   = token ? `${window.location.origin}/#/verify/${token}` : "";

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 720 }}>
        <h2>Issue AdbS Verification Link</h2>
        <p className="subtle">
          Create a verification link for this shipment. Driver receives the AdbS Truck-Driver Verify Link.
        </p>

        <div className="form" style={{ marginTop: 10 }}>
          <label className="form-label">USDOT# (optional for demo)</label>
          <input className="input" value={usdot} onChange={e=>setUsdot(e.target.value)} placeholder="e.g., 1234567" />

          <label className="form-label">License Plate (optional for demo)</label>
          <input className="input" value={plate} onChange={e=>setPlate(e.target.value)} placeholder="e.g., ABC12345" />

          <label className="form-label">Driver Phone (optional for demo)</label>
          <input
            className="input"
            value={driverPhone}
            onChange={(e) => {
              let v = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
              if (v.length > 6) v = `${v.slice(0,3)}-${v.slice(3,6)}-${v.slice(6)}`;
              else if (v.length > 3) v = `${v.slice(0,3)}-${v.slice(3)}`;
              setDriverPhone(v);
            }}
            placeholder="123-456-7890"
          />

          {/* Primary action uses your exact wording */}
          <button className="btn pri
