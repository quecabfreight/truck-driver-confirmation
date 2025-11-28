import React, { useState } from "react";

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "broker",
    mcNumber: "",
    ein: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    // MC Number: digits only, no formatting yet
    if (name === "mcNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    // Business Phone: auto-format as 123-456-7890
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 10); // max 10 digits
      let formatted = digits;

      if (digits.length > 3 && digits.length <= 6) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
      } else if (digits.length > 6) {
        formatted = `${digits.slice(0, 3)}-${digits.slice(
          3,
          6
        )}-${digits.slice(6)}`;
      }

      setForm((prev) => ({ ...prev, phone: formatted }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Simple front-end check: required fields
    if (!form.legalName || !form.contactName || !form.phone || !form.email) {
      setStatus({
        type: "error",
        message: "Please fill in all required fields before submitting.",
      });
      return;
    }

    setStatus({
      type: "success",
      message:
        "Request received. In this demo build, the form is not yet wired to the live AdbS Control Center.",
    });

    // later: send to backend / email
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

          <form onSubmit={handleSubmit} className="qc-form">
            <div className="qc-form-grid">
              <div className="qc-field">
                <label className="qc-label">
                  Legal Name / Legal Business Name
                  <span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={form.legalName}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="Your full legal name or your company’s legal name"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Primary Contact Name<span className="qc-required">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="Who will manage AdbS access?"
                />
              </div>

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

              <div className="qc-field">
                <label className="qc-label">
                  MC Number<span className="qc-required">*</span>
                </label>
                <div className="qc-mc-row">
                  <span className="qc-mc-tag">MC</span>
                  <input
                    type="text"
                    name="mcNumber"
                    value={form.mcNumber}
                    onChange={handleChange}
                    className="qc-input qc-input-mc"
                    placeholder="123456"
                    inputMode="numeric"
                  />
                </div>
                <div className="qc-help">
                  Digits only. We&apos;ll handle formatting on our side.
                </div>
              </div>

              <div className="qc-field">
                <label className="qc-label">EIN (optional)</label>
                <input
                  type="text"
                  name="ein"
                  value={form.ein}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Phone<span className="qc-required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="For urgent verification calls"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Email<span className="qc-required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="Where AdbS access details will be sent"
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
