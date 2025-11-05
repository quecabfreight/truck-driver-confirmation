import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem("qcab_auth_hint", JSON.stringify({ email, ts: Date.now() }));
    }
    // For Phase 1: go to panel (Smart Link generator demo)
    nav("/panel", { replace: true });
  };

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <img src="/qc-logo.png" alt="QueCab AdbS" className="centered-logo" />
      <h2 style={{ marginTop: 6, marginBottom: 14 }}>Log In</h2>
      <form onSubmit={onSubmit} className="form" style={{ textAlign: "left", marginTop: 10 }}>
        <div>
          <div className="form-label">Business Email</div>
          <input
            className="input"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <div className="form-label">Access Code</div>
          <input
            className="input"
            type="password"
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            style={{ width: 20, height: 20 }}
          />
          Remember this device
        </label>
        <button className="btn primary" type="submit">Continue</button>
      </form>
    </div>
  );
}
