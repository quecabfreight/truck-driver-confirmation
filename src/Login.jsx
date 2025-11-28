import React, { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    accessCode: "",
    remember: true,
  });

  const [status, setStatus] = useState(null);

  function handleChange(e) {
    const { name, type, checked, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.email || !form.accessCode) {
      setStatus({
        type: "error",
        message: "Enter your business email and access code to continue.",
      });
      return;
    }

    setStatus({
      type: "success",
      message:
        "Demo only. In the live system this will verify your access code and open the AdbS Control Center.",
    });
  }

  return (
    <div className="qc-shell qc-form-shell">
      <div className="qc-inner qc-form-inner">
        <div className="qc-form-card">
          <h1 className="qc-heading qc-form-heading">Log In</h1>

          <p className="qc-sub qc-form-sub">
            For authorized brokers and shippers with an active QueCab AdbS
            subscription and access code.
          </p>

          <form onSubmit={handleSubmit} className="qc-form">
            <div className="qc-form-grid">
              {/* EMAIL */}
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
                  placeholder="name@business.com"
                />
              </div>

              {/* ACCESS CODE */}
              <div className="qc-field">
                <label className="qc-label">
                  Access Code<span className="qc-required">*</span>
                </label>
                <input
                  type="password"
                  name="accessCode"
                  value={form.accessCode}
                  onChange={handleChange}
                  className="qc-input"
                  placeholder="Enter your AdbS access code"
                />
              </div>

              {/* REMEMBER DEVICE */}
              <div className="qc-field">
                <label className="qc-label">&nbsp;</label>
                <label className="qc-remember-row">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                  />
                  <span>Remember this device</span>
                </label>
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
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
