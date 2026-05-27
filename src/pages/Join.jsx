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
  const [ein, setEin] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [acceptedBeta, setAcceptedBeta] = useState(false);

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = acceptedBeta && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg("");
    setStatusMsg("");

    if (!acceptedBeta) {
      setErrorMsg(
        "You must acknowledge the beta notice before requesting access."
      );
      return;
    }

    if (!String(legalName || "").trim()) {
      setErrorMsg("Enter Legal Name.");
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

    setSubmitting(true);

    try {
      const payload = {
        legal_name: String(legalName || "").trim(),
        contact_name: String(contactName || "").trim(),
        business_email: String(businessEmail || "")
          .trim()
          .toLowerCase(),
        business_phone: String(businessPhone || "").trim(),
        mc_number: onlyDigits(mcNumber),
        ein: String(ein || "").trim(),
        role: String(role || "broker").trim().toLowerCase(),
        accepted_beta_notice: true
      };

      const res = await fetch("/api/request_access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

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
      setEin("");
      setBusinessPhone("");
      setAcceptedBeta(false);

      setSubmitting(false);
    } catch {
      setErrorMsg("Network error submitting request.");
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.steelGlow} />
      <div style={styles.gridOverlay} />

      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.kicker}>FOUNDING BETA ACCESS</div>

        <div style={styles.card}>
          <div style={styles.title}>Request Broker Access</div>

          <div style={styles.subtitle}>
            QueCab AdbS™ is currently onboarding founding beta brokers for
            pre-load Truck-Driver verification before freight is released.
          </div>

          <div style={styles.infoBar}>
            <div style={styles.infoTitle}>Founding Beta Access</div>

            <div style={styles.infoText}>
              $49/month during beta • Future pricing begins at $149/month
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Legal Business Name</div>

              <input
                style={styles.input}
                placeholder="Legal Business Name"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Primary Contact Name</div>

              <input
                style={styles.input}
                placeholder="Primary Contact Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Broker Role</div>

              <select
                style={styles.input}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="broker">Broker</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Business Email</div>

              <input
                style={styles.input}
                placeholder="name@company.com"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>MC#</div>

              <input
                style={styles.input}
                placeholder="MC#"
                value={mcNumber}
                onChange={(e) =>
                  setMcNumber(onlyDigits(e.target.value))
                }
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>EIN (Optional)</div>

              <input
                style={styles.input}
                placeholder="EIN (optional)"
                value={ein}
                onChange={(e) => setEin(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.inputLabel}>Business Phone</div>

              <input
                style={styles.input}
                placeholder="123-456-7890"
                value={businessPhone}
                onChange={(e) =>
                  setBusinessPhone(
                    formatPhoneHyphen(e.target.value)
                  )
                }
              />
            </div>

            <div style={styles.betaBox}>
              <label style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  checked={acceptedBeta}
                  onChange={(e) =>
                    setAcceptedBeta(e.target.checked)
                  }
                  style={styles.checkbox}
                />

                <span>
                  I understand that QueCab AdbS™ is currently operating in beta
                  and that verification decisions remain the responsibility of
                  the broker.
                </span>
              </label>

              <div style={styles.betaNotice}>
                QueCab AdbS™ assists pre-load Truck-Driver verification
                workflows but does not guarantee prevention of fraud, cargo
                theft, double brokering, or operational loss in every
                circumstance.
              </div>
            </div>

            {errorMsg ? (
              <div style={styles.error}>{errorMsg}</div>
            ) : null}

            {statusMsg ? (
              <div style={styles.status}>{statusMsg}</div>
            ) : null}

            <button
              type="submit"
              style={canSubmit ? styles.button : styles.buttonDisabled}
              disabled={!canSubmit}
              title={
                acceptedBeta
                  ? "Submit request access form"
                  : "Check the beta acknowledgment box before requesting access."
              }
            >
              {submitting
                ? "Submitting Request..."
                : "Request Access"}
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
    position: "relative",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #070b11 0%, #0d1522 48%, #111d2c 100%)",
    color: "#e6edf5",
    overflow: "hidden"
  },

  steelGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(0,85,190,0.22), transparent 38%), radial-gradient(circle at bottom right, rgba(120,160,210,0.10), transparent 34%)"
  },

  gridOverlay: {
    position: "absolute",
    inset: 0,
    opacity: 0.075,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "42px 42px"
  },

  heroLogoWrap: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 12
  },

  heroLogo: {
    width: 220,
    maxWidth: "90%"
  },

  container: {
    position: "relative",
    zIndex: 2,
    maxWidth: 720,
    margin: "0 auto",
    padding: "0 20px 60px"
  },

  kicker: {
    textAlign: "center",
    color: "#8fc7ff",
    fontWeight: 900,
    letterSpacing: 2,
    fontSize: 13,
    marginBottom: 14
  },

  card: {
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.065), rgba(255,255,255,0.035))",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 20,
    padding: 30,
    boxShadow: "0 18px 44px rgba(0,0,0,0.36)"
  },

  title: {
    fontSize: 38,
    fontWeight: 950,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: "-0.4px"
  },

  subtitle: {
    fontSize: 16,
    color: "#cbd7e8",
    lineHeight: 1.7,
    textAlign: "center",
    marginBottom: 22
  },

  infoBar: {
    border: "1px solid rgba(120,180,255,0.28)",
    background:
      "linear-gradient(180deg, rgba(30,80,150,0.22), rgba(8,20,40,0.34))",
    borderRadius: 16,
    padding: 18,
    marginBottom: 26
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 6
  },

  infoText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#d5e1f0"
  },

  form: {
    display: "grid",
    gap: 16
  },

  inputGroup: {
    display: "grid",
    gap: 8
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 1,
    color: "#8fc7ff"
  },

  input: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.20)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.045))",
    color: "#ffffff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
  },

  betaBox: {
    marginTop: 6,
    padding: 18,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,9,18,0.30)"
  },

  checkboxWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    fontSize: 14,
    lineHeight: 1.6,
    cursor: "pointer",
    color: "#d6dfeb"
  },

  checkbox: {
    marginTop: 3,
    transform: "scale(1.15)",
    cursor: "pointer"
  },

  betaNotice: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 1.65,
    color: "#aebed4"
  },

  button: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(120,180,255,0.55)",
    background:
      "linear-gradient(180deg, rgba(52,120,205,0.72), rgba(26,72,130,0.86))",
    color: "#fff",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(0,0,0,0.28)"
  },

  buttonDisabled: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(90,90,90,0.18), rgba(40,40,40,0.18))",
    color: "rgba(255,255,255,0.42)",
    fontSize: 16,
    fontWeight: 950,
    cursor: "not-allowed",
    opacity: 0.72
  },

  error: {
    color: "#ff9c9c",
    fontWeight: 800,
    fontSize: 14
  },

  status: {
    color: "#9cffbd",
    fontWeight: 800,
    fontSize: 14
  },

  bottomText: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 14,
    color: "#c9d6e6"
  },

  link: {
    color: "#8fc7ff",
    textDecoration: "none",
    fontWeight: 900
  }
};
