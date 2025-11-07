import React, { useState } from "react";

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "Broker",
    mc: "",
    ein: "",
    phone: ""
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPhone = (v) => {
    let s = v.replace(/[^\d]/g, "").slice(0, 10);
    if (s.length > 6) s = `${s.slice(0,3)}-${s.slice(3,6)}-${s.slice(6)}`;
    else if (s.length > 3) s = `${s.slice(0,3)}-${s.slice(3)}`;
    set("phone", s);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    alert("Request submitted (demo).");
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
        {/* TITLE matches Home (≈32pt desktop) */}
        <h2 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: "clamp(26px, 2.8vw + 14px, 42px)" }}>
          Request Access
        </h2>
        {/* SUBLINE matches Home helper size (≈24pt desktop) */}
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
          Brokers &amp; Shippers only.
        </p>

        <form className="form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Legal Name</label>
          <input className="input" value={form.legalName} onChange={(e)=>set("legalName", e.target.value)} placeholder="Company Inc." />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Contact Name</label>
          <input className="input" value={form.contactName} onChange={(e)=>set("contactName", e.target.value)} placeholder="First Last" />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Role</label>
          <select className="select" value={form.role} onChange={(e)=>set("role", e.target.value)}>
            <option>Broker</option>
            <option>Shipper</option>
          </select>

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>MC (tag+digits only)</label>
          <input className="input" value={form.mc} onChange={(e)=>set("mc", e.target.value)} placeholder="MC123456" />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>EIN (optional)</label>
          <input className="input" value={form.ein} onChange={(e)=>set("ein", e.target.value)} placeholder="##-#######" />

          <label className="form-label" style={{ fontSize: "clamp(18px, 0.9vw + 14px, 24px)" }}>Business Phone</label>
          <input className="input" value={form.phone} onChange={(e)=>onPhone(e.target.value)} placeholder="123-456-7890" />

          <button className="btn primary" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
