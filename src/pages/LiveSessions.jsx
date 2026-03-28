import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function fmtDate(v) {
  if (!v) return "(unknown)";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleString();
  } catch {
    return String(v);
  }
}

function statusChip(status) {
  const s = String(status || "").toLowerCase();
  if (s === "active") {
    return {
      text: "ACTIVE",
      style: {
        border: "1px solid rgba(80,200,120,0.55)",
        background: "rgba(30,120,60,0.22)",
        color: "#dfffe8"
      }
    };
  }
  if (s === "revoked") {
    return {
      text: "REVOKED",
      style: {
        border: "1px solid rgba(255,80,80,0.55)",
        background: "rgba(150,30,30,0.22)",
        color: "#ffdede"
      }
    };
  }
  return {
    text: String(status || "UNKNOWN").toUpperCase(),
    style: {
      border: "1px solid rgba(255,255,255,0.18)",
      background: "rgba(255,255,255,0.06)",
      color: "#ffffff"
    }
  };
}

export default function LiveSessions() {
  const nav = useNavigate();

  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const authorized = !!email && isBrokerOrShipper(email);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastRefresh, setLastRefresh] = useState("");

  useEffect(() => {
    if (!authorized) {
      nav("/login", { replace: true });
      return;
    }
  }, [authorized, nav]);

  useEffect(() => {
    if (!authorized) return;

    let timer = null;

    async function loadRows() {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await fetch("/api/live_sessions?status=active&limit=50");
        const data = await res.json();

        if (!res.ok || !data?.ok) {
          setLoading(false);
          setErrorMsg(data?.error || "Could not load live sessions.");
          return;
        }

        setRows(Array.isArray(data.rows) ? data.rows : []);
        setLastRefresh(new Date().toLocaleTimeString());
        setStatusMsg("Live sessions updated.");
        setLoading(false);
      } catch {
        setLoading(false);
        setErrorMsg("Network error loading live sessions.");
      }
    }

    loadRows();
    timer = setInterval(loadRows, 5000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [authorized]);

  if (!authorized) return null;

  const pageWrap = {
    minHeight: "100vh",
    background: "transparent"
  };

  const outer = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "18px 16px 48px"
  };

  const heroLogoWrap = {
    display: "flex",
    justifyContent: "center",
    marginTop: 90,
    marginBottom: 10
  };

  const heroLogo = {
    width: 220,
    maxWidth: "90%"
  };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12,18,28,0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.28)"
  };

  const title = {
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 14,
    color: "#fff"
  };

  const sectionTitle = {
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 12,
    color: "#fff"
  };

  const buttonPrimary = {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(120,180,255,0.55)",
    background: "rgba(40,110,190,0.35)",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer"
  };

  return (
    <div style={pageWrap}>
      <Header />

      <div style={heroLogoWrap}>
        <img src="/qc-logo.png" alt="QueCab AdbS" style={heroLogo} />
      </div>

      <div style={outer}>
        <div style={title}>Live Session Mode</div>

        <div style={{ ...card, marginBottom: 16 }}>
          <div style={sectionTitle}>Active Verifications</div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <div style={{ opacity: 0.85 }}>
              These update automatically every few seconds.
              {lastRefresh ? ` Last refresh: ${lastRefresh}` : ""}
            </div>

            <button
              style={buttonPrimary}
              onClick={() => window.location.reload()}
            >
              Refresh Now
            </button>
          </div>

          {errorMsg ? (
            <div style={{ color: "#ff9c9c", fontWeight: 700, marginBottom: 12 }}>
              {errorMsg}
            </div>
          ) : null}

          {statusMsg ? (
            <div style={{ color: "#ffffff", marginBottom: 12 }}>
              {statusMsg}
            </div>
          ) : null}

          {loading && rows.length === 0 ? (
            <div style={{ opacity: 0.8 }}>Loading live sessions...</div>
          ) : null}

          {!loading && rows.length === 0 ? (
            <div style={{ opacity: 0.8 }}>No active verifications right now.</div>
          ) : null}

          {rows.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {rows.map((row) => {
                const chip = statusChip(row.status);

                return (
                  <button
                    key={row.token}
                    type="button"
                    onClick={() => window.open(row.verify_url, "_blank")}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ fontWeight: 900, fontSize: 16 }}>
                        {row.load_id || "(no load id)"} {row.carrier_company ? `| ${row.carrier_company}` : ""}
                      </div>

                      <div
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 900,
                          ...chip.style
                        }}
                      >
                        {chip.text}
                      </div>
                    </div>

                    <div style={{ opacity: 0.88, fontSize: 14, marginTop: 6, lineHeight: 1.55 }}>
                      DOT {row.usdot_on_record || "—"} | Plate {row.plate_on_record || "—"} | Driver {row.driver_phone || "—"}
                      <br />
                      Dock Email: {row.dock_email || "—"} | Created: {fmtDate(row.created_at)}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
