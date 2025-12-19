import React, { useMemo, useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

const onlyDigits = (s) => (s || "").replace(/\D+/g, "");

const formatPhone = (value) => {
  const d = onlyDigits(value).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
};

export default function Join() {
  // DEBUG MARKER (no visual impact)
  useEffect(() => {
    document.title = "JOIN ✅ BUILD MARKER A";
    console.log("JOIN ✅ BUILD MARKER A — Join.jsx is running");
  }, []);

  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("Broker");
  const [mcDigits, setMcDigits] = useState("");
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const mcNumber = useMemo(() => {
    const digits = onlyDigits(mcDigits);
    return digits ? `MC${digits}` : "";
  }, [mcDigits]);

  const canSubmit =
    legalName.trim() &&
    contactName.trim() &&
    businessEmail.trim() &&
    businessPhone.trim() &&
    mcNumber;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!canSubmit) {
      setStatus({
        type: "error",
        message: "Please complete all required fields.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        legal_name: legalName.trim(),
        contact_name: contactName.trim(),
        role: role,
        mc_number: mcNumber,
        ein: ein.trim() || null,
        business_phone: businessPhone.trim(),
        business_email: businessEmail.trim().toLowerCase(),
        status: "pending",
      };

      const { error } = await supabase.from("beta_requests").insert([payload]);
      if (error) throw error;

      setStatus({
        type: "success",
        message:
          "Request received. QueCab AdbS will review and contact you with next steps.",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          err?.message ||
          "Submission failed. Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="qc-form-shell qc-shell">
      <div className="qc-form-inner qc-inner">
        <div className="qc-form-card">
          <h1 className="qc-form-heading">Request Access</h1>
          <p className="qc-sub qc-form-sub">
            Brokers & shippers: submit your onboarding details. QueCab AdbS will review and issue authorized access.
          </p>

          <form className="qc-form" onSubmit={onSubmit}>
            <div className="qc-form-grid">
              <div className="qc-field">
                <label className="qc-label">
                  Legal Business Name <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  autoComplete="organization"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Contact Name <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Role <span className="qc-required">*</span>
                </label>
                <div className="qc-radio-row">
                  <label className="qc-radio">
                    <input
                      type="radio"
                      name="role"
                      checked={role === "Broker"}
                      onChange={() => setRole("Broker")}
                    />
                    Broker
                  </label>
                  <label className="qc-radio">
                    <input
                      type="radio"
                      name="role"
                      checked={role === "Shipper"}
                      onChange={() => setRole("Shipper")}
                    />
                    Shipper
                  </label>
                </div>
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  MC# <span className="qc-required">*</span>
                </label>
                <div className="qc-mc-row">
                  <div className="qc-mc-tag">MC</div>
                  <input
                    className="qc-input qc-input-mc"
                    value={onlyDigits(mcDigits)}
                    onChange={(e) => setMcDigits(onlyDigits(e.target.value))}
                    inputMode="numeric"
                    placeholder="Digits only"
                  />
                </div>
              </div>

              <div className="qc-field">
                <label className="qc-label">EIN (Optional)</label>
                <input
                  className="qc-input"
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  inputMode="numeric"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Phone <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(formatPhone(e.target.value))}
                  inputMode="tel"
                  placeholder="123-456-7890"
                  autoComplete="tel"
                />
              </div>

              <div className="qc-field" style={{ gridColumn: "1 / -1" }}>
                <label className="qc-label">
                  Business Email <span className="qc-required">*</span>
                </label>
                <input
                  className="qc-input"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  inputMode="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {status.message ? (
              <div
                className={
                  "qc-status " +
                  (status.type === "success"
                    ? "qc-status-success"
                    : "qc-status-error")
                }
              >
                {status.message}
              </div>
            ) : null}

            <div className="qc-form-actions">
              <button
                className="qc-btn-primary qc-btn-wide"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
