import { useState } from "react";

// Format 5855061158 -> 585-506-1158
function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Join() {
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [role, setRole] = useState("");
  const [mcNumber, setMcNumber] = useState("");
  const [einTaxId, setEinTaxId] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [status, setStatus] = useState(null);

  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const handlePhoneChange = (e) =>
    setBusinessPhone(formatPhoneNumber(e.target.value));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({
      type: "success",
      message:
        "Request sent (demo). QueCab AdbS will review and email your access details.",
    });
  };

  const layoutStyle = {
    padding: "32px 16px 72px",
    display: "flex",
    justifyContent: "center",
  };

  const cardStyle = {
    maxWidth: "760px",
    width: "100%",
    background:
      "radial-gradient(circle at top, rgba(16,185,129,0.08), rgba(5,10,22,0.98) 45%)",
    borderRadius: "26px",
    padding: "30px",
    border: "1px solid rgba(148,163,184,0.35)",
    boxShadow: "0 28px 70px rgba(0,0,0,0.85)",
  };

  const inputStyle = {
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.5)",
    background: "rgba(3,7,18,0.95)",
    color: "#f9fafb",
    padding: "0 12px",
    fontSize: "0.95rem",
  };

  // 🌟 NEW ILLUSIONIST BUTTON
  const buttonStyle = {
    marginTop: "18px",
    padding: "14px 30px",
    borderRadius: "999px",
    fontSize: "0.95rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
    cursor: "pointer",
    border: "1px solid rgba(52,211,153,0.6)",
    color: "#022c22",
    background: hover
      ? "linear-gradient(135deg, #34d399, #22c55e)"
      : "linear-gradient(135deg, #22c55e, #16a34a)",
    boxShadow: down
      ? `
        inset 0 3px 8px rgba(0,0,0,0.35),
        0 10px 22px rgba(0,0,0,0.9),
        0 0 0 8px rgba(34,197,94,0.18)
      `
      : `
        inset 0 1px 0 rgba(255,255,255,0.45),
        0 22px 42px rgba(0,0,0,0.9),
        0 0 0 10px rgba(34,197,94,0.22)
      `,
    transform: down ? "translateY(1px)" : "translateY(0)",
    transition:
      "box-shadow 160ms ease, transform 120ms ease, background 160ms ease",
  };

  return (
    <main style={layoutStyle}>
      <section style={cardStyle}>
        <h1 style={{ fontSize: "1.9rem", marginBottom: "6px" }}>
          Request Access
        </h1>
        <p style={{ opacity: 0.9, marginBottom: "18px" }}>
          For licensed brokers and shippers requesting QueCab AdbS access.
        </p>

        <input style={inputStyle} placeholder="Legal Business Name" />
        <input style={inputStyle} placeholder="Primary Contact Name" />
        <input style={inputStyle} placeholder="MC#" />
        <input
          style={inputStyle}
          placeholder="Business Phone"
          value={businessPhone}
          onChange={handlePhoneChange}
        />
        <input style={inputStyle} placeholder="Business Email" />

        <button
          style={buttonStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            setDown(false);
          }}
          onMouseDown={() => setDown(true)}
          onMouseUp={() => setDown(false)}
        >
          Submit Request
        </button>
      </section>
    </main>
  );
}
