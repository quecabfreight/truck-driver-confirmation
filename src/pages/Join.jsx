import React, { useState } from "react";

const ACCESS_REQUEST_KEY = "adbsv1_access_requests";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatMc(value) {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  return digits ? `MC ${digits}` : "";
}

export default function Join() {
  const [businessName, setBusinessName] = useState("ABC Trucking");
  const [contactName, setContactName] = useState("Rob Johnson");
  const [role, setRole] = useState("Broker");
  const [mcNumber, setMcNumber] = useState("");            // ⬅️ STARTS EMPTY NOW
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("585-506-1158");
  const [businessEmail, setBusinessEmail] = useState("quecabinc@gmail.com");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const requestRecord = {
        id: `REQ-${Date.now()}`,
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        role,
        mcNumber: mcNumber.trim(),
        ein: ein.trim(),
        businessPhone: businessPhone.trim(),
        businessEmail: businessEmail.trim(),
        createdAt: Date.now(),
      };

      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem(ACCESS_REQUEST_KEY) || "[]");
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }

      const updated = [requestRecord, ...existing].slice(0, 50);
      localStorage.setItem(ACCESS_REQUEST_KEY, JSON.stringify(updated));

      setSuccessMessage(
        "Demo only – your access request has been recorded locally. In production this would notify QueCab AdbS support or your account admin."
      );
    } catch (err) {
      console.error("Failed to save access request:", err);
      setErrorMessage("Demo error – unable to save this request in the browser.");
    }
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
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "32px 34px 26px",
          borderRadius: "20px",
          width: "860px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.75)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "6px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "15px",
            marginBottom: "20px",
            opacity: 0.9,
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        {errorMessage && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(248,113,113,0.7)",
              background: "rgba(248,113,113,0.08)",
              color: "#fecaca",
              fontSize: "14px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(74,222,128,0.7)",
              background: "rgba(34,197,94,0.12)",
              color: "#bbf7d0",
              fontSize: "14px",
            }}
          >
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 20px",
            marginBottom: "18px",
          }}
        >
          {/* Business name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Legal Name or Legal Business Name *
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Contact name */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Primary Contact Name *
            </label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Role */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Role *
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "15px",
              }}
            >
              <label>
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
              <label>
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

          {/* MC number */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              MC Number *
            </label>
            <input
              type="text"
              required
              placeholder="MC 000000"                        // ⬅️ JUST A PLACEHOLDER
              value={mcNumber}
              onChange={(e) => setMcNumber(formatMc(e.target.value))}
              style={inputStyle}
            />
          </div>

          {/* EIN (optional) */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              EIN (optional)
            </label>
            <input
              type="text"
              value={ein}
              onChange={(e) => setEin(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Business phone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Business Phone *
            </label>
            <input
              type="tel"
              required
              value={businessPhone}
              onChange={(e) => setBusinessPhone(formatPhone(e.target.value))}
              style={inputStyle}
            />
          </div>

          {/* Business email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Business Email *
            </label>
            <input
              type="email"
              required
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Submit button – full row */}
          <div
            style={{
              gridColumn: "1 / span 2",
              marginTop: "4px",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "14px 26px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
                width: "220px",
              }}
            >
              Submit Request
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: "4px",
            fontSize: "13px",
            padding: "10px 12px",
            borderRadius: "10px",
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(34,197,94,0.5)",
          }}
        >
          Demo only – in production this form would create an access request
          record and notify QueCab AdbS support or your account admin.
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 11px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #64748b",
  background: "#0f172a",
  color: "white",
};
