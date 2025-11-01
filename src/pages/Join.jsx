import React, { useState } from "react";

const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "var(--bg)",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
  },
  bar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid var(--border)",
    background: "color-mix(in oklab, var(--bg) 96%, white 4%)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "var(--muted)",
    textTransform: "uppercase",
  },
  wrap: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "36px 16px",
  },
  card: {
    width: "100%",
    maxWidth: 620,
    background: "linear-gradient(180deg, rgba(22,22,22,0.98), rgba(14,14,14,0.98))",
    border: "1px solid var(--border)",
    borderRadius: 16,
    boxShadow: "0 36px 120px rgba(0,0,0,0.28)",
    padding: 22,
  },
  title: { fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" },
  subtitle: { marginTop: 4, fontSize: 13.5, color: "var(--muted)" },

  form: { marginTop: 14 },
  row: { marginTop: 14 },

  label: {
    fontSize: 13.5,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    fontSize: 16,
    lineHeight: 1.4,
    color: "var(--text)",
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 10,
    padding: "12px 13px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
  },

  // Role radio
  roleWrap: { display: "flex", gap: 18 },
  roleItem: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700 },

  // Prefixed field (MC / SHP)
  prefWrap: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "stretch",
    gap: 0,
  },
  prefTag: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
    fontSize: 13,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.16)",
    borderRight: "none",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    color: "var(--muted)",
    letterSpacing: "0.06em",
    userSelect: "none",
  },
  prefInput: {
    width: "100%",
    fontSize: 16,
    lineHeight: 1.4,
    color: "var(--text)",
    background: "linear-gradient(180deg, rgba(0,0,0,0.70), rgba(0,0,0,0.60))",
    border: "1px solid rgba(255,255,255,0.16)",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: "12px 13px",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4)",
  },

  button: {
    width: "100%",
    marginTop: 16,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#e5e7eb",
    background: "linear-gradient(180deg, rgba(18,18,18,1), rgba(0,0,0,1))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
  },
};

export default function Join() {
  const [role, setRole] = useState("broker"); // "broker" | "shipper"
  const [legalName, setLegalName] = useState("");
  const [contact, setContact] = useState("");
  const [mcShp, setMcShp] = useState("");
  const [ein, setEin] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // --- Format helpers ---
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

  // MC/SHP: digits only, up to 8 (MC can be 6–7; allow 8 for future-proof)
  const handleMcShp = (v) => setMcShp(toDigits(v).slice(0, 8));

  const submit = (e) => {
    e.preventDefault();
    // TODO: wire to backend; this is just the clean front-end.
    // Payload idea:
    // {
    //   role, legalName, contact,
    //   mc_or_shp: { prefix: role === 'broker' ? 'MC' : 'SHP', number: mcShp },
    //   ein, phone, email
    // }
    alert("Submitted (stub).");
  };

  const prefix = role === "broker" ? "MC" : "SHP";

  return (
    <div style={s.page}>
      <div style={s.bar}>Request Access</div>

      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.title}>Join QueCab AdbS</div>
          <div style={s.subtitle}>
            Brokers and shippers only. After review, approved accounts receive an authorization
            code to verify carriers at the dock.
          </div>

          <form onSubmit={submit} style={s.form}>
            {/* Legal Name */}
            <div style={s.row}>
              <div style={s.label}>Legal Name (or Legal Business Name)</div>
              <input
                style={s.input}
                type="text"
                placeholder="Example: Power Logistics LLC / or John R. Carter"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
              />
            </div>

            {/* Contact Person */}
            <div style={s.row}>
              <div style={s.label}>Contact Person Name</div>
              <input
                style={s.input}
                type="text"
                placeholder="Dispatcher / Compliance / Shipping Manager"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            {/* Role */}
            <div style={s.row}>
              <div style={s.label}>Your Role</div>
              <div style={s.roleWrap}>
                <label style={s.roleItem}>
                  <input
                    type="radio"
                    name="role"
                    value="broker"
                    checked={role === "broker"}
                    onChange={() => setRole("broker")}
                  />
                  Broker
                </label>
                <label style={s.roleItem}>
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

            {/* MC / SHP Number with auto prefix (no “digits only” text shown) */}
            <div style={s.row}>
              <div style={s.label}>{role === "broker" ? "MC Number" : "SHP Number"}</div>
              <div style={s.prefWrap}>
                <div style={s.prefTag}>{prefix}</div>
                <input
                  style={s.prefInput}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter number"
                  value={mcShp}
                  onChange={(e) => handleMcShp(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EIN (optional) — no helper paragraph */}
            <div style={s.row}>
              <div style={s.label}>EIN (Tax ID)</div>
              <input
                style={s.input}
                type="text"
                inputMode="numeric"
                placeholder="##-#######"
                value={ein}
                onChange={(e) => setEin(fmtEIN(e.target.value))}
              />
            </div>

            {/* Business Phone (auto-format) */}
            <div style={s.row}>
              <div style={s.label}>Business Phone</div>
              <input
                style={s.input}
                type="tel"
                placeholder="555-123-4567"
                value={phone}
                onChange={(e) => setPhone(fmtPhone(e.target.value))}
                required
              />
            </div>

            {/* Business Email (no helper paragraph) */}
            <div style={s.row}>
              <div style={s.label}>Business Email</div>
              <input
                style={s.input}
                type="email"
                placeholder="dispatch@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Submit */}
            <button type="submit" style={s.button}>Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}
