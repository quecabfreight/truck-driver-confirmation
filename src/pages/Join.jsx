import React, { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function onlyDigits(v = "") {
  return String(v).replace(/\D/g, "");
}

function formatUsPhone(v = "") {
  const d = onlyDigits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

function normalizeMc(v = "") {
  // Keep digits only, max reasonable length (FMCSA MC can be up to 8 digits)
  const d = onlyDigits(v).slice(0, 8);
  return d;
}

export default function Join() {
  const [legalBusinessName, setLegalBusinessName] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [role, setRole] = useState("");
  const [mcNumber, setMcNumber] = useState("");
  const [einTaxId, setEinTaxId] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [betaAcknowledged, setBetaAcknowledged] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const canSubmit = useMemo(() => {
    return (
      legalBusinessName.trim().length > 1 &&
      primaryContactName.trim().length > 1 &&
      (role === "Broker" || role === "Shipper") &&
      normalizeMc(mcNumber).length >= 4 && // basic sanity check
      formatUsPhone(businessPhone).length >= 12 &&
      businessEmail.trim().includes("@") &&
      betaAcknowledged
    );
  }, [
    legalBusinessName,
    primaryContactName,
    role,
    mcNumber,
    businessPhone,
    businessEmail,
    betaAcknowledged,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!canSubmit) {
      setStatus({
        type: "error",
        message:
          "Please complete all required fields and accept the Beta Notice.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        legal_business_name: legalBusinessName.trim(),
        primary_contact_name: primaryContactName.trim(),
        role: role,
        mc_number: normalizeMc(mcNumber),
        ein_tax_id: einTaxId.trim() || null,
        business_phone: formatUsPhone(businessPhone),
        business_email: businessEmail.trim().toLowerCase(),
        beta_acknowledged: true, // IMPORTANT for your policy
      };

      const { error } = await supabase.from("beta_requests").insert([payload]);

      if (error) {
        // Common issue: policy/RLS mismatch
        setStatus({
          type: "error",
          message:
            error.message ||
            "Could not submit. Please try again in a moment.",
        });
        return;
      }

      setStatus({
        type: "success",
        message:
          "Request received. QueCab AdbS will review and contact you with next steps.",
      });

      // Clear the form AFTER success (and keep the UI professional)
      setLegalBusinessName("");
      setPrimaryContactName("");
      setRole("");
      setMcNumber("");
      setEinTaxId("");
      setBusinessPhone("");
      setBusinessEmail("");
      setBetaAcknowledged(false);
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err?.message || "Something went wrong. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.brand}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={styles.logo}
            onError={(e) => {
              // Avoid broken-image ugliness
              e.currentTarget.style.display = "none";
            }}
          />
          <div style={styles.brandText}>QueCab AdbS</div>
        </div>

        <div style={styles.nav}>
          <a style={styles.navLink} href="#/">
            Home
          </a>
          <a style={styles.navLink} href="#/how-it-works">
            How It Works
          </a>
          <a style={styles.navLink} href="#/login">
            Log In
          </a>
          <a style={{ ...styles.navLink, ...styles.navLinkActive }} href="#/join">
            Request Access
          </a>
        </div>
      </div>

      <div style={styles.centerWrap}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.title}>Request Access</div>
            <div style={styles.subtitle}>
              For licensed brokers and shippers who want to use QueCab AdbS to
              verify Truck-Driver units before loading. Fill this out to request
              subscription onboarding.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>
              Legal Business Name <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              value={legalBusinessName}
              onChange={(e) => setLegalBusinessName(e.target.value)}
              placeholder="Exact name from FMCSA / paperwork"
              autoComplete="organization"
            />

            <label style={styles.label}>
              Primary Contact Name <span style={styles.req}>*</span>
            </label>
            <input
              style={styles.input}
              value={primaryContactName}
              onChange={(e) => setPrimaryContactName(e.target.value)}
              placeholder="Who will manage AdbS access?"
              autoComplete="name"
            />

            <label style={styles.label}>
              Role <span style={styles.req}>*</span>
            </label>
            <select
              style={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="Broker">Broker</option>
              <option value="Shipper">Shipper</option>
            </select>

            <div style={styles.row2}>
              <div style={styles.col}>
                <label style={styles.label}>
                  MC# <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  value={mcNumber}
                  onChange={(e) => setMcNumber(normalizeMc(e.target.value))}
                  placeholder="MC123456"
                  inputMode="numeric"
                />
              </div>

              <div style={styles.col}>
                <label style={styles.label}>EIN / Tax ID (optional)</label>
                <input
                  style={styles.input}
                  value={einTaxId}
                  onChange={(e) => setEinTaxId(e.target.value)}
                  placeholder="For billing verification (optional)"
                  autoComplete="off"
                />
              </div>
            </div>

            <div style={styles.row2}>
              <div style={styles.col}>
                <label style={styles.label}>
                  Business Phone <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(formatUsPhone(e.target.value))}
                  placeholder="585-506-1158"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>

              <div style={styles.col}>
                <label style={styles.label}>
                  Business Email <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="name@yourbusiness.com"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.noticeBox}>
              <div style={styles.noticeTitle}>Beta Notice</div>
              <div style={styles.noticeText}>
                This is beta software. QueCab AdbS provides verification prompts
                and alerts to support your fraud-prevention process; it does not
                guarantee authenticity of any carrier, truck, driver, or
                shipment. Do not rely on this system as the only basis for
                releasing freight or loading a vehicle. Use of this beta is at
                your discretion, and features may change without notice.
              </div>

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={betaAcknowledged}
                  onChange={(e) => setBetaAcknowledged(e.target.checked)}
                />
                <span style={styles.checkboxText}>
                  I understand and accept the Beta Notice.
                </span>
              </label>
            </div>

            {status.message ? (
              <div
                style={{
                  ...styles.status,
                  ...(status.type === "success"
                    ? styles.statusSuccess
                    : styles.statusError),
                }}
              >
                {status.message}
              </div>
            ) : null}

            <div style={styles.actions}>
              <button
                type="submit"
                style={{
                  ...styles.button,
                  ...(submitting || !canSubmit
                    ? styles.buttonDisabled
                    : null),
                }}
                disabled={submitting || !canSubmit}
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 700px at 50% 30%, rgba(22, 60, 110, 0.35), rgba(4, 10, 20, 1) 55%, rgba(0,0,0,1) 100%)",
    color: "#e9eef7",
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 26px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    objectFit: "contain",
    filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.7))",
  },
  brandText: {
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 18,
  },
  nav: {
    display: "flex",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  navLink: {
    color: "rgba(233, 238, 247, 0.92)",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    borderBottom: "2px solid transparent",
    paddingBottom: 4,
  },
  navLinkActive: {
    borderBottom: "2px solid rgba(40, 210, 120, 0.95)",
  },
  centerWrap: {
    display: "flex",
    justifyContent: "center",
    padding: "42px 18px 60px",
  },
  card: {
    width: "min(860px, 100%)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(10, 20, 40, 0.85), rgba(6, 10, 18, 0.88))",
    boxShadow:
      "0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
    padding: 26,
  },
  header: { marginBottom: 18 },
  title: { fontSize: 30, fontWeight: 800, letterSpacing: 0.2 },
  subtitle: {
    marginTop: 8,
    color: "rgba(233,238,247,0.72)",
    lineHeight: 1.4,
    fontSize: 13,
  },
  label: {
    display: "block",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(233,238,247,0.88)",
  },
  req: { color: "rgba(255,120,120,0.95)", fontWeight: 900 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.22)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 14,
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.22)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 14,
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 4,
  },
  col: { minWidth: 0 },
  noticeBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.20)",
  },
  noticeTitle: { fontWeight: 900, fontSize: 13, marginBottom: 6 },
  noticeText: {
    color: "rgba(233,238,247,0.78)",
    fontSize: 12,
    lineHeight: 1.45,
  },
  checkboxRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    marginTop: 10,
  },
  checkboxText: {
    color: "rgba(233,238,247,0.92)",
    fontSize: 12,
    lineHeight: 1.35,
    fontWeight: 700,
  },
  status: {
    marginTop: 14,
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
  },
  statusSuccess: {
    border: "1px solid rgba(40, 210, 120, 0.45)",
    background: "rgba(40, 210, 120, 0.10)",
    color: "rgba(200, 255, 225, 0.98)",
  },
  statusError: {
    border: "1px solid rgba(255, 90, 90, 0.45)",
    background: "rgba(255, 90, 90, 0.10)",
    color: "rgba(255, 210, 210, 0.98)",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 14,
  },
  button: {
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    color: "#06120b",
    background:
      "linear-gradient(180deg, rgba(45, 230, 130, 1), rgba(24, 180, 95, 1))",
    boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
  },
  buttonDisabled: {
    opacity: 0.55,
    cursor: "not-allowed",
  },
};
