import React, { useState } from "react";

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "Broker",
    mcNumber: "",
    ein: "",
    businessPhone: "",
    businessEmail: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Auto-format phone number
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "").substring(0, 10);
    if (digits.length < 4) return digits;
    if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Update handler
  function updateField(field, value) {
    if (field === "businessPhone") value = formatPhone(value);
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "680px",
          padding: "40px 36px 46px",
          background: "#020617",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 48px rgba(0,0,0,0.65)",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "6px",
            textAlign: "center",
          }}
        >
          Request Access
        </h1>

        <p
          style={{
            fontSize: "15px",
            opacity: 0.85,
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Legal Name or Legal Business Name *</label>
              <input
                type="text"
                required
                value={form.legalName}
                onChange={(e) => updateField("legalName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Primary Contact Name *</label>
              <input
                type="text"
                required
                value={form.contactName}
                onChange={(e) => updateField("contactName", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "22px", marginBottom: "16px" }}>
            <div>
              <label style={labelStyle}>Role *</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Broker"
                    checked={form.role === "Broker"}
                    onChange={(e) => updateField("role", e.target.value)}
                  />{" "}
                  Broker
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Shipper"
                    checked={form.role === "Shipper"}
                    onChange={(e) => updateField("role", e.target.value)}
                  />{" "}
                  Shipper
                </label>
              </div>
            </div>

            <div>
              <label style={labelStyle}>MC Number *</label>
              <input
                type="text"
                required
                value={form.mcNumber}
                onChange={(e) =>
                  updateField("mcNumber", e.target.value.replace(/\D/g, ""))
                }
                style={{ ...inputStyle, width: "160px" }}
              />
            </div>

            <div>
              <label style={labelStyle}>EIN (optional)</label>
              <input
                type="text"
                value={form.ein}
                onChange={(e) => updateField("ein", e.target.value)}
                style={{ ...inputStyle, width: "160px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "22px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Business Phone *</label>
              <input
                type="text"
                required
                value={form.businessPhone}
                onChange={(e) => updateField("businessPhone", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Business Email *</label>
              <input
                type="email"
                required
                value={form.businessEmail}
                onChange={(e) => updateField("businessEmail", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Submit Request
          </button>
        </form>

        {submitted && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px",
              borderRadius: "12px",
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.7)",
              fontSize: "14px",
              color: "white",
              textAlign: "center",
            }}
          >
            Request received (demo). In production this form would create an
            access request record and notify QueCab AdbS support or your
            account admin.
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "14px",
  display: "block",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  borderRadius: "10px",
  border: "1px solid #64748b",
  background: "#0f172a",
  color: "white",
};
