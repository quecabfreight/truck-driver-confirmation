import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [businessEmail, setBusinessEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function normalizeEmail(v) {
    return (v || "").trim().toLowerCase();
  }

  function normalizeCode(v) {
    const raw = (v || "").trim().toUpperCase();
    if (!raw) return "";
    if (/^\d+$/.test(raw)) return `QC-${raw}`;
    return raw;
  }

  function isApprovedRow(row) {
    const status = (row?.status || "").toString().trim().toLowerCase();
    const approved = row?.approved === true;
    const betaAck = row?.beta_acknowledged === true;
    const statusApproved = status === "approved";
    return approved || betaAck || statusApproved;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    const email = normalizeEmail(businessEmail);
    const code = normalizeCode(accessCode);

    if (!email) return setErrorMsg("Enter your Business Email.");
    if (!code) return setErrorMsg("Enter your Access Code.");

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("beta_requests")
        .select("id, business_email, approved, access_code, status, beta_acknowledged, created_at")
        .ilike("business_email", `%${email}%`)
        .order("created_at", { ascending: false })
        .limit(25);

      if (error) throw error;

      const rows = Array.isArray(data) ? data : [];

      const strictEmailMatch = (r) => normalizeEmail(r?.business_email) === email;
      const strictCodeMatch = (r) => normalizeCode(r?.access_code || "") === code;

      const candidates = rows.filter((r) => strictEmailMatch(r));
      if (candidates.length === 0) {
        setErrorMsg("Login failed. Check your email and access code.");
        return;
      }

      const match = candidates.find((r) => strictCodeMatch(r));
      if (!match) {
        setErrorMsg("Login failed. Check your email and access code.");
        return;
      }

      if (!isApprovedRow(match)) {
        setErrorMsg("Access not approved yet. Please wait for review.");
        return;
      }

      // ✅ store code for issuing verify links
      const session = { email, code, at: new Date().toISOString(), approved: true };

      if (remember) localStorage.setItem("qc_session", JSON.stringify(session));
      else sessionStorage.setItem("qc_session", JSON.stringify(session));

      navigate("/control", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Login failed. Check your email and access code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable="false" />
        </a>

        <div style={styles.card}>
          <div style={styles.title}>Log In</div>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>
              Business Email
              <input
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="you@company.com"
                style={styles.input}
                autoComplete="email"
              />
            </label>

            <label style={styles.label}>
              Access Code
              <input
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="QC-123456 (or just 123456)"
                style={styles.input}
                autoComplete="off"
              />
            </label>

            <label style={styles.checkRow}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span style={styles.checkText}>Remember this device</span>
            </label>

            {errorMsg ? <div style={styles.error}>{errorMsg}</div> : null}

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.75 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
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
      "radial-gradient(1200px 600px at 20% 10%, rgba(58, 110, 160, 0.20), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30, 80, 140, 0.18), transparent 55%), #06090f",
    color: "#e9eef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  shell: { width: "100%", maxWidth: 560 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },
  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  title: { fontSize: 22, fontWeight: 900, marginBottom: 12 },
  label: { display: "block", fontSize: 14, color: "rgba(233, 238, 247, 0.9)", marginBottom: 12 },
  input: {
    width: "100%",
    marginTop: 6,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.25)",
    background: "rgba(8, 12, 20, 0.75)",
    color: "#e9eef7",
    outline: "none",
    fontSize: 16,
  },
  checkRow: { display: "flex", alignItems: "center", gap: 10, margin: "6px 0 12px 0" },
  checkText: { fontSize: 14, color: "rgba(233, 238, 247, 0.82)" },
  error: {
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(170, 30, 30, 0.18)",
    border: "1px solid rgba(255, 80, 80, 0.28)",
    color: "#ffd7d7",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(110, 160, 210, 0.28)",
    background: "linear-gradient(180deg, rgba(40, 90, 150, 0.95), rgba(18, 45, 80, 0.95))",
    color: "#e9eef7",
    fontWeight: 900,
    fontSize: 16,
  },
};
