import { useState } from "react";
import Layout from "../components/Layout";

// Format 5855061158 -> 585-506-1158
function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
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

  const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setBusinessPhone(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);

    const missingRequired =
      !legalBusinessName.trim() ||
      !primaryContactName.trim() ||
      !role.trim() ||
      !mcNumber.trim() ||
      !businessPhone.trim() ||
      !businessEmail.trim();

    if (missingRequired) {
      setStatus({
        type: "error",
        message: "Please complete all required fields before submitting.",
      });
      return;
    }

    // Demo-only behavior: show success, then clear the form
    setStatus({
      type: "success",
      message:
        "Request sent (demo). QueCab AdbS will review and email your access details.",
    });

    setLegalBusinessName("");
    setPrimaryContactName("");
    setRole("");
    setMcNumber("");
    setEinTaxId("");
    setBusinessPhone("");
    setBusinessEmail("");
  };

  // Shared inline styles so this page matches the pro look
  const shellStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const layoutStyle = {
    padding: "32px 16px 72px",
    display: "flex",
    justifyContent: "center",
  };

  const cardWrapperStyle = {
    width: "100%",
    maxWidth: "720px",
  };

  const cardStyle = {
    background:
      "linear-gradient(145deg, rgba(9,15,32,0.98), rgba(4,10,24,0.98))",
    borderRadius: "24px",
    padding: "28px 26px 30px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
    border: "1px solid rgba(148,163,184,0.35)",
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginBottom: "6px",
  };

  const subtitleStyle = {
    fontSize: "0.95rem",
    opacity: 0.9,
    marginBottom: "18px",
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: "12px",
    marginTop: "6px",
  };

  const twoColRowStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
    gap: "12px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    marginBottom: "4px",
    opacity: 0.92,
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.5)",
    backgroundColor: "rgba(3,7,18,0.96)",
    color: "#f9fafb",
    padding: "0 12px",
    fontSize: "0.95rem",
    outline: "none",
  };

  const selectStyle = {
    ...inputStyle,
    paddingRight: "32px",
  };

  const requiredStarStyle = {
    color: "#fb7185",
    marginLeft: "2px",
  };

  const statusBannerBase = {
    borderRadius: "10px",
    padding: "9px 12px",
    fontSize: "0.9rem",
    fontWeight: 500,
    marginBottom: "14px",
  };

  const statusBannerSuccess = {
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.16), rgba(5,46,22,0.95))",
    border: "1px solid rgba(52,211,153,0.6)",
    color: "#bbf7d0",
  };

  const statusBannerError = {
    background:
      "linear-gradient(135deg, rgba(239,68,68,0.16), rgba(69,10,10,0.95))",
    border: "1px solid rgba(248,113,113,0.7)",
    color: "#fecaca",
  };

  const buttonRowStyle = {
    marginTop: "16px",
    display: "flex",
    justifyContent: "flex-end",
  };

  const primaryButtonStyle = {
    padding: "10px 24px",
    borderRadius: "999px",
    border: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    background:
      "linear-gradient(135deg, #16a34a, #22c55e)",
    color: "#ffffff",
    boxShadow:
      "0 0 0 1px rgba(0,0,0,0.5), 0 12px 28px rgba(0,0,0,0.9)",
  };

  return (
    <Layout pageTitle="Request Access">
      <main className="page-container request-access-page" style={layoutStyle}>
        <div className="content-shell" style={shellStyle}>
          <div style={cardWrapperStyle}>
            <section style={cardStyle}>
              <h1 style={titleStyle}>Request Access</h1>
              <p style={subtitleStyle}>
                For licensed brokers and shippers who want to use QueCab AdbS to
                verify Truck-Driver units before loading. Fill this out to
                request a subscription and onboarding.
              </p>

              {status && (
                <div
                  style={{
                    ...statusBannerBase,
                    ...(status.type === "success"
                      ? statusBannerSuccess
                      : statusBannerError),
                  }}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={formGridStyle}>
                  <div>
                    <label style={labelStyle}>
                      Legal Business Name
                      <span style={requiredStarStyle}>*</span>
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={legalBusinessName}
                      onChange={(e) => setLegalBusinessName(e.target.value)}
                      placeholder="Exact name from FMCSA / paperwork"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Primary Contact Name
                      <span style={requiredStarStyle}>*</span>
                    </label>
                    <input
                      type="text"
                      style={inputStyle}
                      value={primaryContactName}
                      onChange={(e) => setPrimaryContactName(e.target.value)}
                      placeholder="Who will manage AdbS access?"
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Role
                      <span style={requiredStarStyle}>*</span>
                    </label>
                    <select
                      style={selectStyle}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select role</option>
                      <option value="Broker">Broker</option>
                      <option value="Shipper">Shipper</option>
                      <option value="Broker/Shipper">
                        Broker &amp; Shipper
                      </option>
                    </select>
                  </div>

                  <div style={twoColRowStyle}>
                    <div>
                      <label style={labelStyle}>
                        MC#
                        <span style={requiredStarStyle}>*</span>
                      </label>
                      <input
                        type="text"
                        style={inputStyle}
                        value={mcNumber}
                        onChange={(e) => setMcNumber(e.target.value)}
                        placeholder="MC123456"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        EIN / Tax ID (optional)
                      </label>
                      <input
                        type="text"
                        style={inputStyle}
                        value={einTaxId}
                        onChange={(e) => setEinTaxId(e.target.value)}
                        placeholder="For billing verification (optional)"
                      />
                    </div>
                  </div>

                  <div style={twoColRowStyle}>
                    <div>
                      <label style={labelStyle}>
                        Business Phone
                        <span style={requiredStarStyle}>*</span>
                      </label>
                      <input
                        type="tel"
                        style={inputStyle}
                        value={businessPhone}
                        onChange={handlePhoneChange}
                        placeholder="585-506-1158"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>
                        Business Email
                        <span style={requiredStarStyle}>*</span>
                      </label>
                      <input
                        type="email"
                        style={inputStyle}
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="name@yourbusiness.com"
                      />
                    </div>
                  </div>
                </div>

                <div style={buttonRowStyle}>
                  <button type="submit" style={primaryButtonStyle}>
                    Submit Request
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  );
}
