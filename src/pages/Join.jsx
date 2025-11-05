import React, { useState } from "react";

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "Broker",
    mc: "",
    ein: "",
    phone: "",
  });

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const mcMask = (val) => {
    // Allow "MC" (case-insensitive) + digits (show tag+digits only)
    const clean = val.toUpperCase().replace(/[^MC0-9]/g, "");
    // Ensure it starts with MC
    if (!clean.startsWith("MC")) return "MC" + clean.replace(/[^0-9]/g, "");
    return clean;
  };

  const phoneMask = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    const p1 = digits.slice(0,3);
    const p2 = digits.slice(3,6);
    const p3 = digits.slice(6,10);
    if (digits.length > 6) return `${p1}-${p2}-${p3}`;
    if (digits.length > 3) return `${p1}-${p2}`;
    return p1;
  };

  const submit = (e) => {
    e.preventDefault();
    // Phase 1: no backend. Just show a simple confirmation.
    alert("Request received. We’ll review and email you an access code.");
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: 10 }}>Request Access</h2>
      <form className="form" onSubmit={submit}>
        <div>
          <div className="form-label">Legal Name</div>
          <input
            className="input"
            placeholder="Company Inc."
            value={form.legalName}
            onChange={(e) => onChange("legalName", e.target.value)}
            required
          />
        </div>
        <div>
          <div className="form-label">Contact Name</div>
          <input
            className="input"
            placeholder="First Last"
            value={form.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            required
          />
        </div>
        <div>
          <div className="form-label">Role</div>
          <select
            className="select"
            value={form.role}
            onChange={(e) => onChange("role", e.target.value)}
          >
            <option>Broker</option>
            <option>Shipper</option>
          </select>
        </div>
        <div>
          <div className="form-label">MC (tag+digits only)</div>
          <input
            className="input"
            placeholder="MC123456"
            value={form.mc}
            onChange={(e) => onChange("mc", mcMask(e.target.value))}
            required
          />
        </div>
        <div>
          <div className="form-label">EIN (optional)</div>
          <input
            className="input"
            placeholder="##-#######"
            value={form.ein}
            onChange={(e) => onChange("ein", e.target.value)}
          />
        </div>
        <div>
          <div className="form-label">Business Phone</div>
          <input
            className="input"
            placeholder="123-456-7890"
            value={form.phone}
            onChange={(e) => onChange("phone", phoneMask(e.target.value))}
          />
        </div>

        <button className="btn primary" type="submit">Submit</button>
      </form>
    </div>
  );
}
