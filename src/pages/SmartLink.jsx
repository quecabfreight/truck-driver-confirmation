import React, { useState } from "react";
import { Link } from "react-router-dom";

function randomToken() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}

export default function SmartLink() {
  const [token, setToken] = useState("");
  const [form, setForm] = useState({ dot: "", plate: "", phone: "" });

  const gen = () => setToken(randomToken());

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Issue AdbS Verification Link</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Create a verification link for this shipment.<br/>
          Driver receives the AdbS Truck-Driver Verify Link.
        </p>

        <div className="form" style={{ marginBottom: 16 }}>
          <div>
            <label>USDOT# (optional for demo)</label>
            <input
              className="input"
              value={form.dot}
              onChange={(e)=>setForm({...form, dot:e.target.value})}
              placeholder="e.g., 1234567"
            />
          </div>
          <div>
            <label>License Plate (optional for demo)</label>
            <input
              className="input"
              value={form.plate}
              onChange={(e)=>setForm({...form, plate:e.target.value})}
              placeholder="ABC1234"
            />
          </div>
          <div>
            <label>Driver Phone (optional for demo)</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e)=>setForm({...form, phone:e.target.value})}
              placeholder="123-456-7890"
            />
          </div>
          <button className="btn" onClick={gen}>Generate Token</button>
        </div>

        {token && (
          <div className="card" style={{ marginTop: 10 }}>
            <h2>Links</h2>
            <p><strong>Driver-facing:</strong> <code>/s/{token}</code></p>
            <p><strong>Dock-facing:</strong> <code>/verify/{token}</code></p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
              <Link className="btn" to={`/s/${token}`}>Open Driver Screen</Link>
              <Link className="btn" to={`/verify/${token}`}>Open Dock Screen</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
