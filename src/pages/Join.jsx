import React, { useState } from "react";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;

  if (len <= 3) return digits;
  if (len <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "broker",
    ein: "",
    businessEmail: "",
    mcNumber: "",
    businessPhone: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let nextValue = type === "checkbox" ? checked : value;

    if (name === "mcNumber") {
      // Digits only for MC number
      nextValue = nextValue.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "businessPhone") {
      nextValue = formatPhone(nextValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.legalName || !form.contactName || !form.businessEmail || !form.mcNumber || !form.businessPhone) {
      setStatus({
        type: "error",
        message:
          "For this demo, please complete Legal Name, Contact Name, MC#, Business Email, and Business Phone.",
      });
      return;
    }

    setStatus({
      type: "success",
      message:
        "Request received. In this demo build, the form is not yet wired to the live AdbS Control Center.",
    });
  }

  return (
    <div className="qc-shell qc-form-shell">
      <div className="qc-inner qc-form-inner">
        <div className="qc-form-card">
          <h1 className="qc-heading qc-form-heading">Request Access</h1>
          <p className="qc-sub qc-form-sub">
            For licensed brokers and shippers who want to deploy QueCab AdbS to
            verify Truck-Driver units in real time at the dock.
          </p>

          <form className="qc-form" onSubmit={handleSubmit}>
            <div className="qc-form-grid">
              {/* Legal name */}
              <div className="qc-field">
                <label className="qc-label">
                  Legal Name / Legal Business Name
                  <span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="legalName"
                  className="qc-input"
                  value={form.legalName}
                  onChange={handleChange}
                  placeholder="Full legal name on FMCSA / IRS records"
                />
              </div>

              {/* Primary contact */}
              <div className="qc-field">
                <label className="qc-label">
                  Primary Contact Name<span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  className="qc-input"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Who will manage AdbS access?"
                />
              </div>

              {/* Role */}
              <div className="qc-field">
                <label className="qc-label">
                  Role<span className="qc-required">*</span>
                </label>
                <div className="qc-radio-row">
                  <label className="qc-radio">
                    <input
                      type="radio"
                      name="role"
                      value="broker"
                      checked={form.role === "broker"}
                      onChange={handleChange}
                    />
                    <span>Broker</span>
                  </label>
                  <label className="qc-radio">
                    <input
                      type="radio"
                      name="role"
                      value="shipper"
                      checked={form.role === "shipper"}
                      onChange={handleChange}
                    />
                    <span>Shipper</span>
                  </label>
                </div>
              </div>

              {/* EIN optional */}
              <div className="qc-field">
                <label className="qc-label">EIN (optional)</label>
                <input
                  type="text"
                  name="ein"
                  className="qc-input"
                  value={form.ein}
                  onChange={handleChange}
                  placeholder="XX-XXXXXXX"
                />
              </div>

              {/* Business email */}
              <div className="qc-field">
                <label className="qc-label">
                  Business Email<span className="qc-required">*</span>
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  className="qc-input"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="Where AdbS access details will be sent"
                />
              </div>

              {/* MC number */}
              <div className="qc-field">
                <label className="qc-label">
                  MC Number<span className="qc-required">*</span>
                </label>
                <div className="qc-mc-row">
                  <span className="qc-mc-tag">MC</span>
                  <input
                    type="text"
                    name="mcNumber"
                    className="qc-input qc-input-mc"
                    value={form.mcNumber}
                    onChange={handleChange}
                    placeholder="Digits only"
                  />
                </div>
              </div>

              {/* Business phone */}
              <div className="qc-field">
                <label className="qc-label">
                  Business Phone<span className="qc-required">*</span>
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  className="qc-input"
                  value={form.businessPhone}
                  onChange={handleChange}
                  placeholder="123-456-7890"
                />
              </div>
            </div>

            {status && (
              <div
                className={
                  status.type === "success"
                    ? "qc-status qc-status-success"
                    : "qc-status qc-status-error"
                }
              >
                {status.message}
              </div>
            )}

            <div className="qc-form-actions">
              <button type="submit" className="qc-btn-primary qc-btn-wide">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
