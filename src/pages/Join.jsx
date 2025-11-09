import React, { useState } from "react";

export default function Join() {
  const [role, setRole] = useState("Broker");
  const [mcDigits, setMcDigits] = useState("");

  const handleMcChange = (e) => {
    // keep digits only
    const digits = (e.target.value || "").replace(/\D/g, "");
    setMcDigits(digits);
  };

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
            <input className="input" />
          </div>

          <div>
            <label>Contact Name</label>
            <input className="input" />
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
            <label>MC#</label>
            <input
              className="input"
              inputMode="numeric"
              value={mcDigits}
              onChange={handleMcChange}
            />
          </div>

          <div>
            <label>EIN (optional)</label>
            <input className="input" />
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
