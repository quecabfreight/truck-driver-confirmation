import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (remember) localStorage.setItem("qc_remember", "1");
    nav("/login#/panel"); // placeholder flow per Phase 1
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
        {/* TITLE: same size as Home (≈32pt desktop) */}
        <h2 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: "clamp(26px, 2.8vw + 14px, 42px)" }}>
          Log In
        </h2>
        {/* SUBLINE: same target as Home helper text (≈24pt desktop) */}
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
          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Business Email</label>
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@company.com" />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Access Code</label>
          <input className="input" value={code} onChange={(e)=>setCode(e.target.value)} placeholder="••••••" />

          <label className="form-label" style={{ display:"flex", alignItems:"center", gap:10 }}>
            <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
            Remember this device
          </label>

          <button className="btn primary" type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}
