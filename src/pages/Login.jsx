import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  function onSubmit(e) {
    e.preventDefault();
    alert("Login wiring is coming next. This is the professional shell.");
  }

  return (
    <div className="qc-login-shell qc-shell">
      <div className="qc-form-inner qc-inner">
        <div className="qc-form-card">
          <h1 className="qc-form-heading">Log In</h1>
          <p className="qc-sub qc-form-sub">Authorized brokers/shippers only.</p>

          <form className="qc-form" onSubmit={onSubmit}>
            <div className="qc-form-grid">
              <div className="qc-field" style={{ gridColumn: "1 / -1" }}>
                <label className="qc-label">Business Email</label>
                <input
                  className="qc-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                />
              </div>

              <div className="qc-field" style={{ gridColumn: "1 / -1" }}>
                <label className="qc-label">Access Code</label>
                <input
                  className="qc-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="one-time-code"
                  placeholder="Enter access code"
                />
              </div>

              <div className="qc-field" style={{ gridColumn: "1 / -1" }}>
                <label className="qc-remember-row">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember this device
                </label>
              </div>
            </div>

            <div className="qc-form-actions">
              <button className="qc-btn-primary qc-btn-wide" type="submit">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
