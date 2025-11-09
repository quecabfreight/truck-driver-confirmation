import React, { useState } from "react";

// Formatters
const digits = (s = "") => s.replace(/\D/g, "");
const formatEIN = (s = "") => {
  const d = digits(s).slice(0, 9);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "-" + d.slice(2);
};
const formatPhoneUS = (s = "") => {
  const d = digits(s).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`;
  return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
};

export default function Join() {
  const [role, setRole] = useState("Broker");
  const [mcDigits, setMcDigits] = useState("");
  const [ein, setEin] = useState("");
  const [bizPhone, setBizPhone] = useState("");

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
              onChange={(e) => setMcDigits(digits(e.target.value))}
              placeholder=""
            />
          </div>

          <div>
            <label>EIN (optional)</label>
            <input
              className="input"
              value={ein}
              onChange={(e) => setEin(formatEIN(e.target.value))}
              inputMode="numeric"
              placeholder="12-3456789"
            />
          </div>

          <div>
            <label>Business Phone</label>
            <input
              className="input"
              value={bizPhone}
              onChange={(e) => setBizPhone(formatPhoneUS(e.target.value))}
              inputMode="tel"
              placeholder="123-456-7890"
            />
          </div>

          <button className="btn">Submit</button>
        </div>
      </div>
    </div>
  );
}
