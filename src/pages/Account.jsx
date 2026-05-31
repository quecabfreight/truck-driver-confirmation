import React, { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import { getAuthEmail } from "../utils/auth.js";

export default function Account() {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const current = getAuthEmail() || "";
    setEmail(current);
    setNewEmail(current);
  }, []);

  function onlyDigits(v) {
    return String(v || "").replace(/\D+/g, "");
  }

  function formatPhone(v) {
    const d = onlyDigits(v).slice(0, 10);

    if (d.length <= 3) return d;
    if (d.length <= 6) {
      return `${d.slice(0, 3)}-${d.slice(3)}`;
    }

    return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  }

  async function saveAccount() {
    setStatus("");

    if (!newEmail.trim()) {
      setStatus("Enter your business email.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/account_update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          current_email: email,
          new_email: newEmail,
          business_phone: phone
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus(data.error || "Update failed.");
        setSaving(false);
        return;
      }

      localStorage.setItem("qc_email", newEmail.trim().toLowerCase());

      setEmail(newEmail.trim().toLowerCase());

      setStatus("Account updated successfully.");
    } catch {
      setStatus("Network error.");
    }

    setSaving(false);
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.hero}>
        <img
          src="/qc-logo.png"
          alt="QueCab AdbS"
          style={styles.logo}
        />

        <div style={styles.heroTitle}>
          ACCOUNT SETTINGS
        </div>

        <div style={styles.heroSub}>
          Manage your broker account information.
        </div>
      </div>

      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            Business Email
          </div>

          <input
            style={styles.input}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Business Email"
          />

          <div style={styles.sectionTitle}>
            Business Phone
          </div>

          <input
            style={styles.input}
            value={phone}
            onChange={(e) =>
              setPhone(formatPhone(e.target.value))
            }
            placeholder="Business Phone"
          />

          <button
            style={styles.button}
            onClick={saveAccount}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {status ? (
            <div style={styles.status}>
              {status}
            </div>
          ) : null}
        </div>

        <div style={styles.noteCard}>
          <div style={styles.noteTitle}>
            Beta Notice
          </div>

          <div style={styles.noteText}>
            During beta, certain account changes may still
            require manual review to protect broker access
            and prevent unauthorized modifications.
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #08111b 0%, #0c1724 45%, #0f1d2c 100%)",
    color: "#e6edf5"
  },

  hero: {
    textAlign: "center",
    padding: "60px 20px 30px"
  },

  logo: {
    width: 220,
    maxWidth: "92%",
    marginBottom: 18,
    filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.45))"
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: 1,
    marginBottom: 10
  },

  heroSub: {
    fontSize: 16,
    opacity: 0.82,
    maxWidth: 700,
    margin: "0 auto",
    lineHeight: 1.6
  },

  wrap: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "0 20px 60px",
    display: "grid",
    gap: 18
  },

  card: {
    background: "rgba(255,255,255,0.045)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 22,
    padding: 24,
    backdropFilter: "blur(10px)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.34)"
  },

  noteCard: {
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 10
  },

  noteText: {
    fontSize: 14,
    opacity: 0.82,
    lineHeight: 1.6
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 800,
    marginBottom: 8,
    marginTop: 14
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box"
  },

  button: {
    width: "100%",
    marginTop: 22,
    padding: 15,
    borderRadius: 14,
    border: "1px solid rgba(120,180,255,0.45)",
    background:
      "linear-gradient(180deg, rgba(34,116,255,0.55) 0%, rgba(20,76,170,0.55) 100%)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer"
  },

  status: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: 700,
    color: "#9fe3b1"
  }
};
