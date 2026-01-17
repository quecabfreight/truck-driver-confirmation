import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "../lib/session";

function ControlCenter() {
  const navigate = useNavigate();
  const session = getSession();

  function logout() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>Control Center</div>
      <div style={styles.cardSub}>
        Logged in as <b>{session?.email || "unknown"}</b>
      </div>

      <div style={styles.hr} />

      <div style={styles.notice}>
        Phase 1: Access verified.  
        Phase 2: Link issuing + dock verification will appear here next.
      </div>

      <div style={styles.actions}>
        <button onClick={logout} style={styles.buttonDanger}>
          Log Out
        </button>
      </div>
    </div>
  );
}

function PublicHome() {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>QueCab AdbS</div>
      <div style={styles.cardSub}>
        Anti-Double-Brokering verification built for real docks.
      </div>

      <div style={styles.rows}>
        <Link to="/join" style={styles.rowButton}>
          Request Access
        </Link>

        <Link to="/login" style={styles.rowButton}>
          Already Authorized? Log In
        </Link>

        <Link to="/about" style={styles.rowButton}>
          About
        </Link>
      </div>

      <div style={styles.footer}>
        © {new Date().getFullYear()} QueCab AdbS — Professional verification for
        brokers &amp; shippers.
      </div>
    </div>
  );
}

export default function Home() {
  const session = getSession();
  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topRow}>
          <a href="/#/" style={styles.brandLink} aria-label="Go Home">
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              style={styles.logo}
              draggable="false"
            />
          </a>
        </div>

        {session?.approved ? <ControlCenter /> : <PublicHome />}
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
  shell: { width: "100%", maxWidth: 760 },
  topRow: { display: "flex", justifyContent: "flex-start", marginBottom: 14 },
  brandLink: { display: "inline-flex", alignItems: "center" },
  logo: { width: 220, height: "auto" },

  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 22, fontWeight: 900, marginBottom: 6 },
  cardSub: { fontSize: 14, color: "rgba(233, 238, 247, 0.75)" },
  rows: { display: "flex", flexDirection: "column", gap: 12, marginTop: 16 },

  rowButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "14px 14px",
    borderRadius: 14,
    background: "rgba(14, 22, 38, 0.65)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.95)",
    textDecoration: "none",
    fontSize: 18,
    fontWeight: 900,
  },

  hr: {
    height: 1,
    background: "rgba(110, 160, 210, 0.18)",
    margin: "14px 0",
  },

  notice: {
    padding: "12px 12px",
    borderRadius: 12,
    background: "rgba(40, 90, 150, 0.14)",
    border: "1px solid rgba(110, 160, 210, 0.18)",
    color: "rgba(233, 238, 247, 0.9)",
    fontSize: 14,
  },

  actions: { display: "flex", justifyContent: "flex-end", marginTop: 14 },
  buttonDanger: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255, 80, 80, 0.28)",
    background: "rgba(170, 30, 30, 0.18)",
    color: "#ffd7d7",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
  },

  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
