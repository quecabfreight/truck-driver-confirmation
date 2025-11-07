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
      <div className="card" style={{ maxWidth: 760 }}>
        <h2>Request Access</h2>
        <p className="subtle">Brokers &amp; Shippers only.</p>

        <form className="form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <label className="form-label">Legal Name</label>
          <input className="input" value={form.legalName} onChange={(e)=>set("legalName", e.target.value)} placeholder="Company Inc." />

          <label className="form-label">Contact Name</label>
          <input className="input" value={form.contactName} onChange={(e)=>set("contactName", e.target.value)} placeholder="First Last" />

          <label className="form-label">Role</label>
          <select className="select" value={form.role} onChange={(e)=>set("role", e.target.value)}>
            <option>Broker</option>
            <option>Shipper</option>
          </select>

          <label className="form-label">MC (tag+digits only)</label>
          <input className="input" value={form.mc} onChange={(e)=>set("mc", e.target.value)} placeholder="MC123456" />

          <label className="form-label">EIN (optional)</label>
          <input className="input" value={form.ein} onChange={(e)=>set("ein", e.target.value)} placeholder="##-#######" />

          <label className="form-label">Business Phone</label>
          <input className="input" value={form.phone} onChange={(e)=>onPhone(e.target.value)} placeholder="123-456-7890" />

          <button className="btn primary" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
