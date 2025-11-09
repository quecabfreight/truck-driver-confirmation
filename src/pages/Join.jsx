import React, { useState } from "react";

export default function Join() {
  const [role, setRole] = useState("Broker");

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Request Access</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Brokers &amp; Shippers only.
        </p>

        <div className="form">
          <div>
            <label>Legal Name or (Company Name)</label>
            <input className="input" placeholder="Company Inc." />
          </div>

          <div>
            <label>Contact Name</label>
            <input className="input" placeholder="Full name" />
          </div>

          <div>
            <label>Role</label>
            <select
              className="input select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Broker</option>
              <option>Shipper</option>
            </select>
          </div>

          <div>
            <label>MC (tag + digits only) — Just prefix with MC</label>
            <input className="input" placeholder="MC 123456" />
          </div>

          <div>
            <label>EIN (optional)</label>
            <input className="input" placeholder="12-3456789" />
          </div>

          <div>
            <label>Business Phone</label>
            <input className="input" placeholder="123-456-7890" />
          </div>

          <button className="btn">Submit</button>
        </div>
      </div>
    </div>
  );
}
