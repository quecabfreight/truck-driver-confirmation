import { useState } from "react";
import Layout from "../components/Layout";

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

  const [status, setStatus] = useState(null); // { type: "success" | "error", message: string }

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

    // Demo-only behavior: show success, then clear the form.
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

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setBusinessPhone(formatted);
  };

  return (
    <Layout pageTitle="Request Access">
      <main className="page-container request-access-page">
        <div className="content-shell">
          <h1 className="page-title">Request Access</h1>
          <p className="page-subtitle">
            For licensed brokers and shippers who want to use QueCab AdbS to
            verify Truck-Driver units before loading. Fill this out to request a
            subscription and onboarding.
          </p>

          {status && (
            <div
              className={`status-banner ${
                status.type === "success"
                  ? "status-banner-success"
                  : "status-banner-error"
              }`}
            >
              {status.message}
            </div>
          )}

          <section className="card request-access-card">
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-row">
                <label className="form-label">
                  Legal Business Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={legalBusinessName}
                  onChange={(e) => setLegalBusinessName(e.target.value)}
                  placeholder="Exact name from FMCSA / paperwork"
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  Primary Contact Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                  placeholder="Who will manage AdbS access?"
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  Role<span className="required">*</span>
                </label>
                <select
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select role</option>
                  <option value="Broker">Broker</option>
                  <option value="Shipper">Shipper</option>
                  <option value="Broker/Shipper">Broker &amp; Shipper</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">
                  MC#<span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={mcNumber}
                  onChange={(e) => setMcNumber(e.target.value)}
                  placeholder="MC123456"
                />
              </div>

              <div className="form-row">
                <label className="form-label">EIN / Tax ID (optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={einTaxId}
                  onChange={(e) => setEinTaxId(e.target.value)}
                  placeholder="For billing verification (optional)"
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  Business Phone<span className="required">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={businessPhone}
                  onChange={handlePhoneChange}
                  placeholder="585-506-1158"
                />
              </div>

              <div className="form-row">
                <label className="form-label">
                  Business Email<span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="name@yourbusiness.com"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Submit Request
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </Layout>
  );
}
