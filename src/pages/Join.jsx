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
  // IMPORTANT: prevent Join from leaving global "white page" styles behind.
  useEffect(() => {
    const body = document.body;

    // Remove any inline styles previously set by older Join versions
    const prevBg = body.style.background;
    const prevColor = body.style.color;
    const prevOverflow = body.style.overflow;

    body.style.background = "";
    body.style.color = "";
    body.style.overflow = "";

    // Also remove any common "page-specific" body classes if they exist
    body.classList.remove("join-page", "request-access-page", "light-page");

    return () => {
      // Restore what was there before (safe + minimal)
      body.style.background = prevBg;
      body.style.color = prevColor;
      body.style.overflow = prevOverflow;
    };
  }, []);

  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("Broker");
  const [mc, setMc] = useState("");
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const mcClean = useMemo(() => {
    const digits = onlyDigits(mc);
    return digits ? `MC${digits}` : "";
  }, [mc]);

  const canSubmit =
    legalName.trim() &&
    contactName.trim() &&
    businessEmail.trim() &&
    businessPhone.trim() &&
    mcClean;

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!canSubmit) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        legal_name: legalName.trim(),
        contact_name: contactName.trim(),
        role: role,
        mc_number: mcClean, // stored as "MC123456"
        ein: ein.trim() || null,
        business_phone: businessPhone.trim(),
        business_email: businessEmail.trim().toLowerCase(),
        status: "pending",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("beta_requests").insert([payload]);

      if (error) throw error;

      setSuccessMsg(
        "Request received. QueCab AdbS will review and contact you with next steps."
      );

      // Keep the form filled (or clear it) — leaving it filled is safest for now.
      // If Q later wants auto-clear, we’ll do it then.
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err?.message ||
          "Something went wrong submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="qc-page qc-join">
      <div className="qc-card">
        <h1 className="qc-title">Request Access</h1>

        {successMsg ? (
          <div className="qc-success">{successMsg}</div>
        ) : (
          <form onSubmit={onSubmit} className="qc-form">
            <div className="qc-field">
              <label className="qc-label">Legal Business Name</label>
              <input
                className="qc-input"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                autoComplete="organization"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">Contact Name</label>
              <input
                className="qc-input"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">Role</label>
              <select
                className="qc-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Broker">Broker</option>
                <option value="Shipper">Shipper</option>
              </select>
            </div>

            <div className="qc-field">
              <label className="qc-label">MC#</label>
              <input
                className="qc-input"
                value={mc}
                onChange={(e) => setMc(e.target.value)}
                placeholder="Digits only"
                inputMode="numeric"
              />
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
              <label className="qc-label">Business Phone</label>
              <input
                className="qc-input"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(formatPhone(e.target.value))}
                placeholder="123-456-7890"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div className="qc-field">
              <label className="qc-label">Business Email</label>
              <input
                className="qc-input"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="name@company.com"
                inputMode="email"
                autoComplete="email"
              />
            </div>

            {errorMsg ? <div className="qc-error">{errorMsg}</div> : null}

            <div className="qc-actions">
              <button className="qc-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
