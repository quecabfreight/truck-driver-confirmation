import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  // Prefill from prior "remember this device"
  const [email, setEmail] = useState(localStorage.getItem("qc_email") || "");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(
    localStorage.getItem("qc_remember") === "1" ? true : false
  );

  // If this device is remembered, skip the login screen entirely
  useEffect(() => {
    const remembered = localStorage.getItem("qc_remember") === "1";
    const savedEmail = localStorage.getItem("qc_email");
    if (remembered && savedEmail) {
      // Phase 1: no panel yet → send to Home (per spec)
      nav("/", { replace: true });
    }
  }, [nav]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Phase 1: accept any non-empty email+code as demo auth
    const ok = email.trim().length > 0 && code.trim().length > 0;
    if (!ok) {
      alert("Enter your business email and access code.");
      return;
    }

    if (remember) {
      localStorage.setItem("qc_remember", "1");
      localStorage.setItem("qc_email", email.trim());
      // optional: store a timestamp if we want expiry later
      localStorage.setItem("qc_remember_at", String(Date.now()));
    } else {
      localStorage.removeItem("qc_remember");
      localStorage.removeItem("qc_email");
      localStorage.removeItem("qc_remember_at");
    }

    // Phase 1 flow: redirect to Home until Smart Link panel is wired
    nav("/", { replace: true });
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
        {/* Title and helper line match Home sizes */}
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
