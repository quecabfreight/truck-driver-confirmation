import React, { useState } from "react";

export default function Join() {
  // ------- State -------
  const [role, setRole] = useState("broker"); // "broker" | "shipper"
  const [legalName, setLegalName] = useState("");
  const [contact, setContact] = useState("");
  const [mcShp, setMcShp] = useState("");
  const [ein, setEin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // ------- Helpers -------
  const toDigits = (v) => (v || "").replace(/\D+/g, "");
  const fmtPhone = (v) => {
    const d = toDigits(v).slice(0, 10);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`;
  };
  const fmtEIN = (v) => {
    const d = toDigits(v).slice(0, 9);
    if (d.length <= 2) return d;
    return `${d.slice(0,2)}-${d.slice(2)}`;
  };
  const handleMcShp = (v) => setMcShp(toDigits(v).slice(0, 8));
  const prefix = role === "broker" ? "MC" : "SHP";

  const submit = (e) => {
    e.preventDefault();
    // TODO: wire to backend
    alert("Submitted (stub).");
  };

  // ------- Styles (theme-aware using CSS vars) -------
  const page = {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  };
  const wrap = {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  };
  const card = {
    width: "100%",
    maxWidth: 720,
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "0 42px 120px rgba(0,0,0,0.22)",
    padding: 22,
  };

  const title = { fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" };
  const subtitle = { marginTop: 6, fontSize: "0.95rem", color: "var(--muted)" };

  const form = { marginTop: 16 };
  const row = { marginTop: 16 };

  const label = {
    fontSize: "0.95rem",
    fontWeight: 900,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "var(--text)",
    opacity: 0.92,
  };

  // inputs: use clean white on light / polished dark on dark
  const baseInput = {
    width: "100%",
    fontSize: "1rem",
    lineHeight: 1.4,
    color: "var(--text)",
    background: "color-mix(in oklab, var(--card) 96%, white 4%)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 13px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.06)",
  };

  const prefWrap = {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "stretch",
    gap: 0,
  };
  const prefTag = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
    fontSize: "0.9rem",
    fontWeight: 900,
    border: "1px solid var(--border)",
    borderRight: "none",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    background: "color-mix(in oklab, var(--card) 96%, black 4%)",
    color: "var(--muted)",
    letterSpacing: "0.06em",
    userSelect: "none",
  };
  const prefInput = {
    ...baseInput,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  };

  const roleWrap = { display: "flex", gap: 20, marginTop: 2 };
  const roleItem = { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "0.98rem" };

  const button = {
    width: "100%",
    marginTop: 18,
    fontSize: "1rem",
    fontWeight: 900,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#e5e7eb",
    background: "linear-gradient(180deg, rgba(18,18,18,1), rgba(0,0,0,1))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  return (
    <div style={page}>
      {/* Local CSS for placeholder color and light/dark polish */}
      <style>{`
        /* Make placeholders readable using your muted var */
        .join-form input::placeholder,
        .join-form textarea::placeholder {
          color: var(--muted);
          opacity: 0.95;
        }

        /* Light theme polish */
        html.light .join-form .input {
          background: #ffffff;
          border-color: rgba(15,23,42,0.10);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
        }
        html.light .join-form .tag {
          background: #f6f7f9;
          border-color: rgba(15,23,42,0.10);
          color: #4b5563;
        }

        /* Dark theme polish */
        html.dark .join-form .input {
          background: linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60));
          border-color: rgba(255,255,255,0.14);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.40);
        }
        html.dark .join-form .tag {
          background: linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60));
          border-color: rgba(255,255,255,0.14);
          color: var(--muted);
        }
      `}</style>

      <div style={wrap}>
        <div style={card} className="join-form">
          <div style={title}>Join QueCab AdbS</div>
          <div style={subtitle}>
            Brokers and shippers only. After review, approved accounts receive an authorization
            code to verify carriers at the dock.
          </div>

          <form onSubmit={submit} style={form}>
            {/* Legal Name */}
            <div style={row}>
              <div style={label}>Legal Name (or Legal Business Name)</div>
              <input
                className="input"
                style={baseInput}
                type="text"
                placeholder="Example: Power Logistics LLC / or John R. Carter"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
              />
            </div>

            {/* Contact Person */}
            <div style={row}>
              <div style={label}>Contact Person Name</div>
              <input
                className="input"
                style={baseInput}
                type="text"
                placeholder="Dispatcher / Compliance / Shipping Manager"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div style={row}>
              <div style={label}>Your Role</div>
              <div style={roleWrap}>
                <label style={roleItem}>
                  <input
                    type="radio"
                    name="role"
                    value="broker"
                    checked={role === "broker"}
                    onChange={() => setRole("broker")}
                  />
                  Broker
                </label>
                <label style={roleItem}>
                  <input
                    type="radio"
                    name="role"
                    value="shipper"
                    checked={role === "shipper"}
                    onChange={() => setRole("shipper")}
                  />
                  Shipper
                </label>
              </div>
            </div>

            {/* MC / SHP Number */}
            <div style={row}>
              <div style={label}>{role === "broker" ? "MC Number" : "SHP Number"}</div>
              <div style={prefWrap}>
                <div className="tag" style={prefTag}>{prefix}</div>
                <input
                  className="input"
                  style={prefInput}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter number"
                  value={mcShp}
                  onChange={(e) => handleMcShp(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EIN (optional) */}
            <div style={row}>
              <div style={label}>EIN (Tax ID)</div>
              <input
                className="input"
                style={baseInput}
                type="text"
                inputMode="numeric"
                placeholder="##-#######"
                value={ein}
                onChange={(e) => setEin(fmtEIN(e.target.value))}
              />
            </div>

            {/* Business Phone */}
            <div style={row}>
              <div style={label}>Business Phone</div>
              <input
                className="input"
                style={baseInput}
                type="tel"
                placeholder="555-123-4567"
                value={phone}
                onChange={(e) => setPhone(fmtPhone(e.target.value))}
                required
              />
            </div>

            {/* Business Email */}
            <div style={row}>
              <div style={label}>Business Email</div>
              <input
                className="input"
                style={baseInput}
                type="email"
                placeholder="dispatch@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" style={button}>Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}
