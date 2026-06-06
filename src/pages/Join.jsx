import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

function onlyDigits(s) {
  return String(s || "").replace(/\D+/g, "");
}

function formatPhoneHyphen(s) {
  const d = onlyDigits(s).slice(0, 10);
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);

  if (d.length <= 3) return a;
  if (d.length <= 6) return `${a}-${b}`;
  return `${a}-${b}-${c}`;
}

export default function Join() {
  const [legalName, setLegalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [role, setRole] = useState("broker");
  const [businessEmail, setBusinessEmail] = useState("");
  const [mcNumber, setMcNumber] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [acceptedBeta, setAcceptedBeta] = useState(false);

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg("");
    setStatusMsg("");

    if (!String(legalName || "").trim()) {
      setErrorMsg("Enter Name or Legal Business Name.");
      return;
    }

    if (!String(contactName || "").trim()) {
      setErrorMsg("Enter Contact Name.");
      return;
    }

    if (!String(businessEmail || "").trim()) {
      setErrorMsg("Enter Business Email.");
      return;
    }

    if (!String(mcNumber || "").trim()) {
      setErrorMsg("Enter MC#.");
      return;
    }

    if (onlyDigits(businessPhone).length !== 10) {
      setErrorMsg("Enter Business Phone.");
      return;
    }

    if (!acceptedBeta) {
      setErrorMsg("Beta notice acknowledgment is required.");
      return;
    }

    setSubmitting(true);

    try {
      const cleanBusinessName = String(legalName || "").trim();
      const cleanEmail = String(businessEmail || "").trim().toLowerCase();

      const payload = {
        legal_name: cleanBusinessName,
        legal_business_name: cleanBusinessName,
        business_name: cleanBusinessName,
        company_name: cleanBusinessName,

        contact_name: String(contactName || "").trim(),

        business_email: cleanEmail,
        email: cleanEmail,

        business_phone: String(businessPhone || "").trim(),
        phone: String(businessPhone || "").trim(),

        mc_number: onlyDigits(mcNumber),
        mc: onlyDigits(mcNumber),

        role: String(role || "broker").trim().toLowerCase(),

        beta_acknowledged: true,
        beta_notice_acknowledged: true,
        beta_notice_accepted: true,
        accepted_beta: true,
        beta_accepted: true,
        acknowledged_beta: true
      };

      const res = await fetch("/api/request_access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || "Could not submit request.");
        setSubmitting(false);
        return;
      }

      setStatusMsg("Request submitted.");

      setLegalName("");
      setContactName("");
      setRole("broker");
      setBusinessEmail("");
      setMcNumber("");
      setBusinessPhone("");
      setAcceptedBeta(false);
    } catch (err) {
      setErrorMsg("Network error submitting request.");
    }

    setSubmitting(false);
  }

  return (
    <div style={styles.wrapper}>
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Request Access</div>

          <div style={styles.subtitle}>
            Beta access is currently for brokers. Submit your business details for review.
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Name or Legal Business Name"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Contact Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <select
              style={styles.input}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="broker">Broker</option>
            </select>

            <input
              style={styles.input}
              placeholder="Business Email"
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="MC#"
              value={mcNumber}
              onChange={(e) => setMcNumber(onlyDigits(e.target.value))}
            />

            <input
              style={styles.input}
              placeholder="Business Phone"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(formatPhoneHyphen(e.target.value))}
            />

            <div style={styles.betaBox}>
              <label style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  checked={acceptedBeta}
                  onChange={(e) => setAcceptedBeta(e.target.checked)}
                  style={styles.checkbox}
                />

                <span>
                  I understand that QueCab AdbS™ is currently operating in beta
                  and that verification decisions remain the responsibility of
                  the broker.
                </span>
              </label>

              <div style={styles.betaNotice}>
                QueCab AdbS™ assists pre-load Truck-Driver verification workflows
                but does not guarantee prevention of fraud, cargo theft, double
                brokering, or operational loss in every circumstance.
              </div>
            </div>

            {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}
            {statusMsg ? <div style={styles.status}>{statusMsg}</div> : null}

            <button type="submit" style={styles.button} disabled={submitting}>
              {submitting ? "Submitting..." : "Request Access"}
            </button>
          </form>

          <div style={styles.bottomText}>
            Already authorized?{" "}
            <Link to="/login" style={styles.link}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0c121c",
    color: "#e6edf5"
  },

  heroLogoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10
  },

  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },

  container: {
    maxWidth: 620,
    margin: "0 auto",
    padding: "0 20px 40px"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  },

  title: {
    fontSize: 30,
    fontWeight: 900,
    marginBottom: 10,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 15,
    opacity: 0.82,
    lineHeight: 1.5,
    textAlign: "center",
    marginBottom: 22
  },

  form: {
    display: "grid",
    gap: 12
  },

  input: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none"
  },

  betaBox: {
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)"
  },

  checkboxWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    fontSize: 14,
    lineHeight: 1.5,
    cursor: "pointer"
  },

  checkbox: {
    marginTop: 3,
    transform: "scale(1.15)",
    cursor: "pointer"
  },

  betaNotice: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 1.5,
    opacity: 0.72
  },

  button: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
    opacity: 1
  },

  error: {
    color: "#ff9c9c",
    fontWeight: 700,
    fontSize: 14
  },

  status: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 14
  },

  bottomText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.88
  },

  link: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 800
  }
};
