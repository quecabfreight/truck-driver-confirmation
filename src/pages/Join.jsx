import React, { useMemo, useState } from "react";
import { supabase } from "../utils/supabaseClient";

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}

function formatPhone(v) {
  const d = onlyDigits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function normalizeMc(v) {
  return onlyDigits(v).slice(0, 10);
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
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (!canSubmit) {
      setStatus({
        type: "error",
        message: "Please complete all required fields before submitting.",
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
      status: "pending",
      created_at: new Date().toISOString(),
    };

    try {
      setSubmitting(true);

      const { error } = await supabase.from("beta_requests").insert([payload]);

      if (error) throw error;

      setStatus({
        type: "success",
        message:
          "Request received. QueCab AdbS will review and contact you with next steps.",
      });

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
          err?.message ||
          "Submission failed. Check Supabase settings and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="qc-shell" style={{ padding: "30px 16px 46px" }}>
      <div className="qc-inner" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(8,10,16,.55)",
            border: "1px solid rgba(255,255,255,.10)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 18px 40px rgba(0,0,0,.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1 className="qc-heading" style={{ margin: "0 0 6px" }}>
            Request Access
          </h1>
          <p className="qc-sub" style={{ margin: "0 0 18px", opacity: 0.9 }}>
            Submit your information to request access to QueCab AdbS. All
            requests are reviewed before access is granted.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px 16px",
              }}
            >
              <div>
                <label style={{ fontWeight: 800 }}>
                  Legal Name / Legal Business Name{" "}
                  <span style={{ color: "#ff5b5b" }}>*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.legal_name}
                  onChange={(e) => setField("legal_name", e.target.value)}
                  placeholder="Exact legal name"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>
                  Contact Name <span style={{ color: "#ff5b5b" }}>*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.contact_name}
                  onChange={(e) => setField("contact_name", e.target.value)}
                  placeholder="Primary contact"
                  autoComplete="name"
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>
                  Role <span style={{ color: "#ff5b5b" }}>*</span>
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

              <div>
                <label style={{ fontWeight: 800 }}>
                  MC# <span style={{ color: "#ff5b5b" }}>*</span>
                </label>
                <input
                  className="qc-input"
                  value={form.mc_number}
                  onChange={(e) => setField("mc_number", e.target.value)}
                  placeholder="MC123456"
                  inputMode="numeric"
                />
              </div>

              <div>
                <label style={{ fontWeight: 800 }}>
                  Business Phone <span style={{ color: "#ff5b5b" }}>*</span>
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

              <div>
                <label style={{ fontWeight: 800 }}>
                  Business Email <span style={{ color: "#ff5b5b" }}>*</span>
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
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.14)",
                  fontWeight: 800,
                  background:
                    status.type === "success"
                      ? "rgba(20,120,80,.18)"
                      : "rgba(140,30,30,.18)",
                }}
              >
                {status.message}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button
                type="submit"
                className="qc-navbtn"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>

            <p style={{ marginTop: 14, opacity: 0.8, fontSize: 12 }}>
              Manual approval required. Access codes are issued after review.
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px){
          .qc-inner{ max-width: 980px !important; }
          form > div[style*="grid-template-columns"]{
            grid-template-columns: 1fr !important;
          }
          .qc-navbtn{ width:100%; }
          div[style*="justify-content: flex-end"]{ justify-content: stretch !important; }
        }
      `}</style>
    </div>
  );
}
