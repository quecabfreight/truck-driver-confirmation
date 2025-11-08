import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <div className="page centered">
      <img src="/qc-logo.png" alt="QueCab AdbS" className="page-logo" />
      <div className="card">
        <h1>Log In</h1>
        <p className="muted" style={{ marginBottom: 18 }}>
          Use your business email and access code.
        </p>

        <div className="form">
          <div>
            <label>Business Email</label>
            <input
              className="input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Access Code</label>
            <input
              className="input"
              placeholder="Enter access code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ width: 24, height: 24 }}
            />
            <label htmlFor="remember">Remember this device</label>
          </div>

          <button className="btn">Continue</button>
        </div>
      </div>
    </div>
  );
}
