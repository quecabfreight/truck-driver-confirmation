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
      <Header />

      <div style={styles.heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.heroLogo} />
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.title}>Account</div>

          <div style={styles.subtitle}>
            Update your broker account contact details during beta.
          </div>

          {loading ? (
            <div style={styles.notice}>Loading account...</div>
          ) : (
            <form onSubmit={saveAccount} style={styles.form}>
              <label style={styles.label}>
                Company
                <input
                  style={styles.input}
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
                  onChange={(e) => setBusinessPhone(formatPhone(e.target.value))}
                  placeholder="123-456-7890"
                />
              </label>

              {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}
              {statusMsg ? <div style={styles.success}>{statusMsg}</div> : null}

              <button type="submit" style={styles.button} disabled={saving}>
                {saving ? "Saving..." : "Save Account Changes"}
              </button>

              <div style={styles.noteBox}>
                <div style={styles.noteTitle}>Access Code Resets</div>
                <div style={styles.noteText}>
                  Access code resets are still handled by QueCab AdbS during beta
                  to prevent lockouts and protect broker access.
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
    maxWidth: 760,
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
    gap: 14
  },
  label: {
    display: "grid",
    gap: 7,
    fontSize: 14,
    fontWeight: 900
  },
  input: {
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.24)",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: 16,
    boxSizing: "border-box",
    outline: "none"
  },
  button: {
    marginTop: 6,
    width: "100%",
    padding: 13,
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer"
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
    marginTop: 14,
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)"
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 900,
    marginBottom: 6
  },
  noteText: {
    fontSize: 14,
    opacity: 0.82,
    lineHeight: 1.5
  }
};
