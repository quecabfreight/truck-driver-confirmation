import React, { useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";

function onlyDigits(value) {
  return (value || "").replace(/\D/g, "");
}

function formatPhone(value) {
  const d = onlyDigits(value).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

function normalizeMc(value) {
  // Store digits only (you wanted: MC tag + digits only)
  // User may type "MC123456" or "123456" — we keep digits.
  return onlyDigits(value).slice(0, 10);
}

export default function Join() {
  const [form, setForm] = useState({
    legal_name: "",
    contact_name: "",
    role: "Broker",
    mc_number: "",
    business_phone: "",
    business_email: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      form.legal_name.trim() &&
      form.contact_name.trim() &&
      form.role.trim() &&
      form.mc_number.trim() &&
      form.business_phone.trim() &&
      form.business_email.trim()
    );
  }, [form]);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!canSubmit) {
      setStatus({
        type: "error",
        message:
          "Please complete all required fields before submitting the request.",
      });
      return;
    }

    const payload = {
      legal_name: form.legal_name.trim(),
      contact_name: form.contact_name.trim(),
      role: form.role.trim(),
      mc_number: normalizeMc(form.mc_number),
      business_phone: form.business_phone.trim(),
      business_email: form.business_email.trim().toLowerCase(),
      // Option A: manual approval. We can still auto-generate a code later,
      // but we do NOT auto-approve here.
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      // If supabase isn’t configured or table missing, we show an error
      // instead of blanking the page.
      if (!supabase) {
        throw new Error(
          "Supabase client not available. Check src/utils/supabaseClient.js."
        );
      }

      const { error } = await supabase.from("beta_requests").insert([payload]);

      if (error) {
        throw error;
      }

      setStatus({
        type: "success",
        message:
          "Request received. QueCab AdbS will review and contact you with next steps.",
      });

      // Clear form after success
      setForm({
        legal_name: "",
        contact_name: "",
        role: "Broker",
        mc_number: "",
        business_phone: "",
        business_email: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          (err && err.message) ||
          "Something went wrong while submitting. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="qc-shell">
      <div className="qc-inner">
        <div className="qc-card">
          <h1 className="qc-heading">Request Access</h1>
          <p className="qc-sub">
            Submit your information to request access to QueCab AdbS. All
            requests are reviewed before access is granted.
          </p>

          <form className="qc-form" onSubmit={handleSubmit}>
            <div className="qc-grid">
              <div className="qc-field">
                <label className="qc-label">
                  Legal Name / Legal Business Name <span className="qc-req">*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.legal_name}
                  onChange={(e) => setField("legal_name", e.target.value)}
                  placeholder="Exact legal name"
                  autoComplete="organization"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Contact Name <span className="qc-req">*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.contact_name}
                  onChange={(e) => setField("contact_name", e.target.value)}
                  placeholder="Primary contact"
                  autoComplete="name"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Role <span className="qc-req">*</span>
                </label>
                <select
                  className="qc-input"
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value)}
                >
                  <option value="Broker">Broker</option>
                  <option value="Shipper">Shipper</option>
                </select>
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  MC# <span className="qc-req">*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.mc_number}
                  onChange={(e) => setField("mc_number", e.target.value)}
                  placeholder="MC123456"
                  inputMode="numeric"
                />
                <div className="qc-help">Digits only are stored.</div>
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Phone <span className="qc-req">*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.business_phone}
                  onChange={(e) =>
                    setField("business_phone", formatPhone(e.target.value))
                  }
                  placeholder="123-456-7890"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>

              <div className="qc-field">
                <label className="qc-label">
                  Business Email <span className="qc-req">*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.business_email}
                  onChange={(e) => setField("business_email", e.target.value)}
                  placeholder="name@company.com"
                  inputMode="email"
                  autoComplete="email"
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

            <div className="qc-actions">
              <button
                type="submit"
                className="qc-btn"
                disabled={!canSubmit || submitting}
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

      {/* Minimal page styles so it looks right even if other CSS gets touched */}
      <style>{`
        .qc-shell{ width:100%; padding: 30px 16px 46px; }
        .qc-inner{ max-width: 980px; margin: 0 auto; }
        .qc-card{
          background: rgba(8,10,16,.55);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 18px 40px rgba(0,0,0,.35);
          backdrop-filter: blur(10px);
        }
        .qc-heading{ margin:0 0 6px; font-size: 34px; font-weight: 900; letter-spacing:.2px; }
        .qc-sub{ margin:0 0 18px; opacity:.9; }
        .qc-form{ margin-top: 10px; }
        .qc-grid{
          display:grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 16px;
        }
        .qc-field{ display:flex; flex-direction:column; gap:6px; }
        .qc-label{ font-weight: 800; }
        .qc-req{ color: #ff5b5b; }
        .qc-input{
          width:100%;
          padding: 12px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(0,0,0,.35);
          color: #e9eefc;
          outline: none;
        }
        .qc-input:focus{ border-color: rgba(120,160,255,.55); box-shadow: 0 0 0 3px rgba(120,160,255,.15); }
        .qc-help{ font-size: 12px; opacity: .75; }
        .qc-actions{ display:flex; justify-content:flex-end; margin-top: 16px; }
        .qc-btn{
          padding: 12px 18px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.14);
          background: linear-gradient(180deg, rgba(80,125,255,.45), rgba(18,28,56,.75));
          color: #fff;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(0,0,0,.35);
        }
        .qc-btn:disabled{ opacity:.55; cursor:not-allowed; }
        .qc-status{
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.14);
          font-weight: 800;
        }
        .qc-status-success{
          background: rgba(20,120,80,.18);
          border-color: rgba(60,200,140,.28);
        }
        .qc-status-error{
          background: rgba(140,30,30,.18);
          border-color: rgba(255,90,90,.28);
        }
        .qc-note{ margin-top: 14px; opacity:.8; font-size: 12px; }
        @media (max-width: 760px){
          .qc-grid{ grid-template-columns: 1fr; }
          .qc-heading{ font-size: 30px; }
          .qc-actions{ justify-content: stretch; }
          .qc-btn{ width:100%; }
        }
      `}</style>
    </div>
  );
}
