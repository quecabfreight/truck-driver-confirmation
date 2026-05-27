import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { getAuthEmail, setAuthEmail } from "../utils/auth.js";

function digits(v) {
  return String(v || "").replace(/\D+/g, "");
}

function formatPhone(v) {
  const d = digits(v).slice(0, 10);

  if (!d) return "";
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;

  return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
}

export default function Account() {
  const currentEmail = getAuthEmail();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessEmail, setBusinessEmail] = useState(currentEmail || "");
  const [contactName, setContactName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function safeJson(res) {
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  async function loadAccount() {
    setLoading(true);
    setErrorMsg("");
    setStatusMsg("");

    if (!currentEmail) {
      setLoading(false);
      setErrorMsg("No signed-in account email found. Please log in again.");
      return;
    }

    try {
      const res = await fetch(
        `/api/account_update?email=${encodeURIComponent(currentEmail)}`
      );

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || "Could not load account.");
        setLoading(false);
        return;
      }

      const account = data.account || {};

      setBusinessEmail(account.business_email || currentEmail);
      setContactName(account.contact_name || "");
      setBusinessPhone(formatPhone(account.business_phone || ""));
      setCompanyName(account.company_name || "");

      setLoading(false);
    } catch {
      setErrorMsg("Could not load account.");
      setLoading(false);
    }
  }

  async function saveAccount(e) {
    e.preventDefault();

    setSaving(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await fetch("/api/account_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          current_email: currentEmail,
          business_email: businessEmail,
          contact_name: contactName,
          business_phone: businessPhone
        })
      });

      const data = await safeJson(res);

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || "Could not update account.");
        setSaving(false);
        return;
      }

      const updated = data.account || {};

      setBusinessEmail(updated.business_email || businessEmail);
      setContactName(updated.contact_name || contactName);
      setBusinessPhone(formatPhone(updated.business_phone || businessPhone));
      setCompanyName(updated.company_name || companyName);

      if (updated.business_email && updated.business_email !== currentEmail) {
        setAuthEmail(updated.business_email, true);
      }

      setStatusMsg("Account updated successfully.");
      setSaving(false);
    } catch {
      setErrorMsg("Could not update account.");
      setSaving(false);
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
        <div style={styles.kicker}>BROKER ACCOUNT SETTINGS</div>

        <div style={styles.card}>
          <div style={styles.title}>Account</div>

          <div style={styles.subtitle}>
            Manage your broker account contact information during founding beta
            access.
          </div>

          {loading ? (
            <div style={styles.notice}>Loading account...</div>
          ) : (
            <form onSubmit={saveAccount} style={styles.form}>
              <div style={styles.panel}>
                <div style={styles.panelTitle}>Broker Profile</div>

                <label style={styles.label}>
                  Company
                  <input
                    style={styles.inputReadOnly}
                    value={companyName}
                    readOnly
                    placeholder="Company"
                  />
                </label>

                <label style={styles.label}>
                  Contact Name
                  <input
                    style={styles.input}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Contact Name"
                  />
                </label>

                <label style={styles.label}>
                  Business Email
                  <input
                    style={styles.input}
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="Business Email"
                  />
                </label>

                <label style={styles.label}>
                  Business Phone
                  <input
                    style={styles.input}
                    value={businessPhone}
                    onChange={(e) =>
                      setBusinessPhone(formatPhone(e.target.value))
                    }
                    placeholder="123-456-7890"
                  />
                </label>
              </div>

              {errorMsg ? (
                <div style={styles.error}>{errorMsg}</div>
              ) : null}

              {statusMsg ? (
                <div style={styles.success}>{statusMsg}</div>
              ) : null}

              <button
                type="submit"
                style={styles.button}
                disabled={saving}
              >
                {saving
                  ? "Saving Account Changes..."
                  : "Save Account Changes"}
              </button>

              <div style={styles.noteBox}>
                <div style={styles.noteTitle}>
                  Founding Beta Account Protection
                </div>

                <div style={styles.noteText}>
                  Access code resets are still handled by QueCab AdbS™ during
                  beta to help prevent broker lockouts and unauthorized account
                  changes.
                </div>
              </div>
            </form>
          )}
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
    maxWidth: 760,
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
    marginBottom: 24
  },

  form: {
    display: "grid",
    gap: 18
  },

  panel: {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",
    borderRadius: 18,
    padding: 20
  },

  panelTitle: {
    fontSize: 20,
    fontWeight: 950,
    marginBottom: 18
  },

  label: {
    display: "grid",
    gap: 8,
    marginBottom: 16,
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

  inputReadOnly: {
    width: "100%",
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.03)",
    color: "#c7d3e4",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none"
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

  notice: {
    textAlign: "center",
    opacity: 0.8,
    padding: 20
  },

  error: {
    color: "#ff9c9c",
    fontWeight: 800
  },

  success: {
    color: "#9cffbd",
    fontWeight: 800
  },

  noteBox: {
    marginTop: 2,
    padding: 18,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(3,9,18,0.30)"
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: 950,
    marginBottom: 8
  },

  noteText: {
    fontSize: 14,
    lineHeight: 1.65,
    color: "#d3ddec"
  }
};
