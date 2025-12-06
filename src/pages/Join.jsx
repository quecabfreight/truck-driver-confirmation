import React, { useState } from "react";

// Auto-format phone as 123-456-7890
function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Join() {
  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("Broker");
  const [mcNumber, setMcNumber] = useState("");
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Demo only
    console.log("Request Access (demo):", {
      legalName,
      contactName,
      role,
      mcNumber,
      ein,
      businessPhone,
      businessEmail,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "40px 40px 36px",
          borderRadius: "18px",
          width: "720px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "14px",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{
              width: "72px",
              height: "72px",
              objectFit: "contain",
              marginBottom: "6px",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "15px",
            opacity: 0.9,
            marginBottom: "20px",
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        <form onSubmit={handleSubmit}>
          {/* ROW 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
              marginBottom: "14px",
            }}
          >
            <Field
              label="Legal Name or Legal Business Name *"
              value={legalName}
              onChange={setLegalName}
            />
            <Field
              label="Primary Contact Name *"
              value={contactName}
              onChange={setContactName}
            />
          </div>

          {/* ROW 2 – ROLE + MC + EIN */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "14px 18px",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  marginBottom: "4px",
                }}
              >
                Role *
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                }}
              >
                <label style={{ fontSize: "14px" }}>
                  <input
                    type="radio"
                    name="role"
                    value="Broker"
                    checked={role === "Broker"}
                    onChange={() => setRole("Broker")}
                    style={{ marginRight: "6px" }}
                  />
                  Broker
                </label>
                <label style={{ fontSize: "14px" }}>
                  <input
                    type="radio"
                    name="role"
                    value="Shipper"
                    checked={role === "Shipper"}
                    onChange={() => setRole("Shipper")}
                    style={{ marginRight: "6px" }}
                  />
                  Shipper
                </label>
              </div>
            </div>

            <Field
              label="MC Number *"
              value={mcNumber}
              onChange={(v) => setMcNumber(v.toUpperCase())}
            />

            <Field
              label="EIN (optional)"
              value={ein}
              onChange={setEin}
            />
          </div>

          {/* ROW 3 – PHONE + EMAIL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: "14px 18px",
              marginBottom: "18px",
            }}
          >
            <Field
              label="Business Phone *"
              value={businessPhone}
              onChange={(v) => setBusinessPhone(formatPhone(v))}
            />
            <Field
              label="Business Email *"
              value={businessEmail}
              onChange={setBusinessEmail}
              type="email"
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "14px 30px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 600,
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
            }}
          >
            Submit Request
          </button>
        </form>

        <div
          style={{
            marginTop: "16px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Demo only – in production this form would create an access request
          record and notify QueCab AdbS support or your account admin.
        </div>

        {submitted && (
          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: "#a5f3fc",
            }}
          >
            Submitted (demo only) – no live data has been stored.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "14px",
          marginBottom: "4px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 11px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #64748b",
          background: "#0f172a",
          color: "white",
        }}
        required={label.includes("*")}
      />
    </div>
  );
}
