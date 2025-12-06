import React, { useState } from "react";

export default function Join() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

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
          width: "780px",
          background: "#020617",
          borderRadius: "18px",
          border: "1px solid rgba(148,163,184,0.55)",
          boxShadow: "0 20px 55px rgba(0,0,0,0.7)",
          padding: "30px 32px 32px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "4px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "15px",
            marginBottom: "18px",
            opacity: 0.85,
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        {submitted && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.7)",
              fontSize: "14px",
            }}
          >
            Demo only – your request would be forwarded to QueCab AdbS support
            or your account admin.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 18px",
            }}
          >
            <Field label="Legal Name or Legal Business Name *" />
            <Field label="Primary Contact Name *" />
            <Field label="Role *" placeholder="Broker or Shipper" />
            <Field label="MC Number *" placeholder="MC 000000" />
            <Field label="EIN (optional)" />
            <Field label="Business Phone *" placeholder="123-456-7890" />
            <Field label="Business Email *" />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: "20px",
              padding: "14px 26px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background:
                "linear-gradient(90deg, #22c55e 0%, #0ea5e9 50%, #22c55e 100%)",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          Demo only – in production this form would create an access request
          record and notify QueCab AdbS support or your account admin.
        </p>
      </div>
    </div>
  );
}

function Field({ label, placeholder }) {
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
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 11px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #64748b",
          background: "#0f172a",
          color: "white",
        }}
      />
    </div>
  );
}
