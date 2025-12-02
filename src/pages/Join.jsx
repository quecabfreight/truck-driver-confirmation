import { useState } from "react";
import { submitAccessRequest } from "../api/requestAccessApi";

export default function Join() {
  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("Broker"); // Broker or Shipper
  const [mcNumber, setMcNumber] = useState("");
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Auto-format phone as 123-456-7890
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    const len = digits.length;

    if (len <= 3) return digits;
    if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e) => {
    setBusinessPhone(formatPhone(e.target.value));
  };

  // Uppercase & tidy MC and EIN
  const handleMcChange = (e) => {
    const raw = e.target.value.toUpperCase();
    setMcNumber(raw);
  };

  const handleEinChange = (e) => {
    const raw = e.target.value.toUpperCase();
    setEin(raw);
  };

  const resetForm = () => {
    setLegalName("");
    setContactName("");
    setRole("Broker");
    setMcNumber("");
    setEin("");
    setBusinessPhone("");
    setBusinessEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        legalName: legalName.trim(),
        contactName: contactName.trim(),
        role,
        mcNumber: mcNumber.trim(),
        ein: ein.trim(),
        businessPhone: businessPhone.trim(),
        businessEmail: businessEmail.trim(),
      };

      // Basic front-end check
      if (!payload.legalName || !payload.contactName || !payload.mcNumber || !payload.businessEmail) {
        setErrorMessage(
          "Please complete all required fields (Legal Name, Contact Name, MC Number, Business Email)."
        );
        setSubmitting(false);
        return;
      }

      const result = await submitAccessRequest(payload);

      if (result.ok) {
        setSuccessMessage(
          result.message ||
            "Demo only – your request has been recorded. In production this would alert QueCab AdbS support."
        );
        resetForm();
      } else {
        setErrorMessage(
          result.message || "Unable to submit your request in this demo."
        );
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error while submitting your request.");
    } finally {
      setSubmitting(false);
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
        background: "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
      }}
    >
      <div
        style={{
          background: "#020617",
          padding: "40px",
          borderRadius: "18px",
          width: "900px",
          border: "1px solid rgba(148,163,184,0.6)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
          color: "white",
        }}
      >
        {/* HEADER */}
        <h1
          style={{
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          Request Access
        </h1>
        <p
          style={{
            fontSize: "16px",
            marginBottom: "24px",
            opacity: 0.8,
          }}
        >
          For licensed brokers and shippers who want to deploy QueCab AdbS to
          verify Truck-Driver links in front of the dock.
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* TOP ROW: LEGAL NAME + CONTACT NAME */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Legal Name or Legal Business Name<span style={{ color: "#f97373" }}> *</span>
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Primary Contact Name<span style={{ color: "#f97373" }}> *</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* ROLE + MC + EIN */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.9fr 0.9fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            {/* ROLE */}
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Role<span style={{ color: "#f97373" }}> *</span>
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  fontSize: "15px",
                  marginTop: "4px",
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

            {/* MC NUMBER */}
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                MC Number<span style={{ color: "#f97373" }}> *</span>
              </label>
              <input
                type="text"
                value={mcNumber}
                onChange={handleMcChange}
                placeholder="MC 000000"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>

            {/* EIN (optional) */}
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                EIN <span style={{ opacity: 0.7 }}>(optional)</span>
              </label>
              <input
                type="text"
                value={ein}
                onChange={handleEinChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* PHONE + EMAIL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Business Phone<span style={{ color: "#f97373" }}> *</span>
              </label>
              <input
                type="text"
                value={businessPhone}
                onChange={handlePhoneChange}
                placeholder="123-456-7890"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "16px",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Business Email<span style={{ color: "#f97373" }}> *</span>
              </label>
              <input
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  border: "1px solid #64748b",
                  background: "#0f172a",
                  color: "white",
                }}
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "12px 26px",
              fontSize: "18px",
              borderRadius: "999px",
              border: "none",
              background: submitting
                ? "linear-gradient(135deg, #6b7280, #9ca3af)"
                : "linear-gradient(135deg, #0ea5e9, #22c55e, #0ea5e9)",
              color: "#0b1120",
              fontWeight: 700,
              cursor: submitting ? "default" : "pointer",
              minWidth: "220px",
            }}
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            style={{
              marginTop: "18px",
              fontSize: "15px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(220, 38, 38, 0.16)",
              border: "1px solid rgba(248, 113, 113, 0.9)",
              color: "#fecaca",
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            style={{
              marginTop: "18px",
              fontSize: "15px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(22, 163, 74, 0.2)",
              border: "1px solid rgba(74, 222, 128, 0.8)",
              color: "#bbf7d0",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* DEMO NOTICE */}
        {!successMessage && !errorMessage && (
          <div
            style={{
              marginTop: "18px",
              fontSize: "15px",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(22, 163, 74, 0.2)",
              border: "1px solid rgba(74, 222, 128, 0.8)",
              color: "#bbf7d0",
            }}
          >
            Demo only – in production this form would create an access request
            record and notify QueCab AdbS support or your account admin.
          </div>
        )}
      </div>
    </div>
  );
}
