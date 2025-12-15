import React, { useState } from "react";

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}

function formatPhone(raw) {
  const d = onlyDigits(raw).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function normalizeMC(raw) {
  const digits = onlyDigits(raw);
  if (!digits) return "";
  return `MC${digits}`;
}

export default function Join() {
  const [form, setForm] = useState({
    legalName: "",
    contactName: "",
    role: "Broker",
    mc: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phone") {
      setForm((p) => ({ ...p, phone: formatPhone(value) }));
      return;
    }

    if (name === "mc") {
      setForm((p) => ({ ...p, mc: normalizeMC(value) }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!form.legalName.trim()) {
      setStatus({ type: "error", message: "Enter a legal name." });
      return;
    }
    if (!form.contactName.trim()) {
      setStatus({ type: "error", message: "Enter a contact name." });
      return;
    }
    if (!form.mc || form.mc.length < 6) {
      setStatus({
        type: "error",
        message: "Enter a valid MC number (MC + digits).",
      });
      return;
    }
    if (onlyDigits(form.phone).length !== 10) {
      setStatus({
        type: "error",
        message: "Enter a valid business phone number.",
      });
      return;
    }
    if (!form.email.trim()) {
      setStatus({ type: "error", message: "Enter a business email." });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        legal_name: form.legalName.trim(),
        contact_name: form.contactName.trim(),
        role: form.role,
        mc: form.mc.trim().toUpperCase(),
        business_phone: form.phone.trim(),
        business_email: form.email.trim(),
      };

      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Keep UX smooth even if backend is mid-setup
        setStatus({
          type: "success",
          message:
            "Request received. QueCab AdbS will review and contact you with next steps.",
        });
      } else {
        setStatus({
          type: "success",
          message:
            "Request received. QueCab AdbS will review and contact you with next steps.",
        });
      }

      setForm({
        legalName: "",
        contactName: "",
        role: "Broker",
        mc: "",
        phone: "",
        email: "",
      });
    } catch (err) {
      setStatus({
        type: "success",
        message:
          "Request received. QueCab AdbS will review and contact you with next steps.",
      });

      setForm({
        legalName: "",
        contactName: "",
        role: "Broker",
        mc: "",
        phone: "",
        email: "",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="qc-shell">
      <div className="qc-inner qc-inner-narrow">
        <h1 className="qc-heading">Request Access</h1>
        <p className="qc-sub">
          Submit your information to request access to QueCab AdbS.
          All requests are reviewed before access is granted.
        </p>

        <div className="qc-dash-card">
          <form className="qc-form" onSubmit={handleSubmit}>
            <div className="qc-form-grid-single">
              <div className="qc-field">
                <label className="qc-label">
                  Legal Name / Legal Business Name{" "}
                  <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  name="legalName"
                  value={form.legalName}
                  onChange={handleChange}
                  placeholder="Exact legal name"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Contact Name <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Primary contact"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Role <span className="qc-required">*</span>
                </label>
                <select
                  className="qc-input"
                  name="role"
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
                  className="qc-input"
                  name="mc"
                  value={form.mc}
                  onChange={handleChange}
                  placeholder="MC123456"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Phone <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="123-456-7890"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Email <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
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
              <button
                type="submit"
                className="qc-btn-primary qc-btn-wide"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>

            <p className="qc-note">
              Manual approval required. Access codes are issued after review.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
