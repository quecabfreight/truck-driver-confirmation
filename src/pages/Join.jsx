// src/pages/Join.jsx
import React, { useState } from "react";

export default function Join() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    role: "Broker",
    mcNumber: "",
    ein: "",
    businessPhone: "",
    businessEmail: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    let nextValue = value;
    if (name === "mcNumber") {
      // Simple MC format helper: strip spaces, uppercase
      nextValue = value.toUpperCase().replace(/\s+/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic required checks for demo
    if (!form.businessName.trim()) {
      setStatus({ type: "error", message: "Enter your legal business name." });
      return;
    }
    if (!form.contactName.trim()) {
      setStatus({
        type: "error",
        message: "Enter a primary contact name.",
      });
      return;
    }
    if (!form.mcNumber.trim()) {
      setStatus({
        type: "error",
        message: "Enter your MC number.",
      });
      return;
    }
    if (!form.businessPhone.trim()) {
      setStatus({
        type: "error",
        message: "Enter a business phone.",
      });
      return;
    }
    if (!form.businessEmail.trim()) {
      setStatus({
        type: "error",
        message: "Enter a business email.",
      });
      return;
    }

    // Demo only – this is where a real API call would go.
    setStatus({
      type: "success",
      message:
        "Request sent. In the live system, QueCab AdbS will review and email your access details.",
    });

    // Clear the form after a successful "submit"
    setForm({
      businessName: "",
      contactName: "",
      role: "Broker",
      mcNumber: "",
      ein: "",
      businessPhone: "",
      businessEmail: "",
    });
  }

  return (
    <div className="qc-shell">
      <div className="qc-inner qc-inner-narrow">
        <header className="qc-page-header">
          <h1 className="qc-heading">Request Access</h1>
          <p className="qc-sub">
            For licensed brokers and shippers who want to use QueCab AdbS to
            verify Truck-Driver units before loading. Fill this out to request
            a subscription and onboarding.
          </p>
        </header>

        <section className="qc-dash-card">
          <form className="qc-form" onSubmit={handleSubmit}>
            <div className="qc-form-grid-single">
              <div className="qc-field">
                <label className="qc-label">
                  Legal Business Name <span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  className="qc-input"
                  value={form.businessName}
                  onChange={handleChange}
                  placeholder="Exact name on FMCSA / paperwork"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Primary Contact Name <span className="qc-required">*</span>
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

              <div className="qc-field">
                <label className="qc-label">
                  Role <span className="qc-required">*</span>
                </label>
                <select
                  name="role"
                  className="qc-input"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="Broker">Broker</option>
                  <option value="Shipper">Shipper</option>
                </select>
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  MC# <span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="mcNumber"
                  className="qc-input"
                  value={form.mcNumber}
                  onChange={handleChange}
                  placeholder="MC123456"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  EIN / Tax ID{" "}
                  <span className="qc-label-optional">optional</span>
                </label>
                <input
                  type="text"
                  name="ein"
                  className="qc-input"
                  value={form.ein}
                  onChange={handleChange}
                  placeholder="For billing verification (optional)"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Phone <span className="qc-required">*</span>
                </label>
                <input
                  type="tel"
                  name="businessPhone"
                  className="qc-input"
                  value={form.businessPhone}
                  onChange={handleChange}
                  placeholder="Main dispatch or office line"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Email <span className="qc-required">*</span>
                </label>
                <input
                  type="email"
                  name="businessEmail"
                  className="qc-input"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="name@business.com"
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

            <p className="qc-note qc-mono qc-mt-sm">
              Demo only. In the live system, this request will create a ticket
              for the QueCab AdbS team to vet your MC, confirm identity, and
              send subscription options.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
