import React, { useState } from "react";

export default function Login() {
  // Prefill if previously remembered (no auto-redirect)
  const [email, setEmail] = useState(localStorage.getItem("qc_email") || "");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(localStorage.getItem("qc_remember") === "1");

  const onSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !code.trim()) {
      alert("Enter your business email and access code.");
      return;
    }

    if (remember) {
      localStorage.setItem("qc_remember", "1");
      localStorage.setItem("qc_email", email.trim());
      localStorage.setItem("qc_remember_at", String(Date.now()));
    } else {
      localStorage.removeItem("qc_remember");
      localStorage.removeItem("qc_email");
      localStorage.removeItem("qc_remember_at");
    }

    // mark authed for this session (optional)
    localStorage.setItem("qc_authed", "1");

    // Hard route (works with HashRouter every time)
    window.location.hash = "#/smart";
  };

  const forgetDevice = () => {
    localStorage.removeItem("qc_remember");
    localStorage.removeItem("qc_email");
    localStorage.removeItem("qc_remember_at");
    setRemember(false);
    setEmail("");
    setCode("");
    alert("This device is no longer remembered.");
  };

  return (
    <div className="container">
      {/* Big metallic logo (top-center) */}
      <img
        src="/qc-logo.png"
        alt="QueCab AdbS"
        className="centered-logo"
        style={{ maxWidth: 360, height: "auto", display: "block", margin: "0 auto 18px" }}
      />

      <div className="card" style={{ maxWidth: 760 }}>
        {/* Titles sized same as Home */}
        <h2 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: "clamp(26px, 2.8vw + 14px, 42px)" }}>
          Log In
        </h2>
        <p
          style={{
            marginTop: 0,
            marginBottom: 12,
            color: "var(--muted)",
            fontWeight: 600,
            letterSpacing: ".1px",
            fontSize: "clamp(18px, 1.6vw + 10px, 32px)"
          }}
        >
          Use your business email and access code.
        </p>

        <form className="form" onSubmit={onSubmit}>
          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>
            Business Email
          </label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>
            Access Code
          </label>
          <input
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="••••••"
          />

          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember this device
          </label>

          <div className="row-actions" style={{ alignItems: "center" }}>
            <button className="btn primary" type="submit">Continue</button>
            <button className="btn" type="button" onClick={forgetDevice}>
              Forget this device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
