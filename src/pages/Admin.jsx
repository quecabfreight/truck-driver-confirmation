// /src/pages/Admin.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { getAuthEmail, isBrokerOrShipper } from "../utils/auth.js";

export default function Admin() {
  const nav = useNavigate();
  const loc = useLocation();

  const email = useMemo(() => {
    try {
      return (getAuthEmail() || "").trim().toLowerCase();
    } catch {
      return "";
    }
  }, []);

  const authorized = useMemo(() => {
    return !!email && isBrokerOrShipper(email);
  }, [email]);

  // App.jsx already protects this route, but we keep it defensive.
  if (!authorized) {
    nav("/login", { replace: true });
    return null;
  }

  const page = { minHeight: "100vh", background: "transparent" };
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "18px 16px 48px" };

  const card = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(12, 18, 28, 0.72)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
  };

  const h1 = { fontSize: 28, fontWeight: 950, margin: "0 0 10px" };
  const p = { fontSize: 15, opacity: 0.85, lineHeight: 1.5, margin: "0 0 14px" };

  const btn = (primary) => ({
    padding: "12px 14px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(140,190,255,0.42)"
      : "1px solid rgba(140,190,255,0.20)",
    background: primary
      ? "linear-gradient(180deg, rgba(40,110,200,0.85), rgba(20,70,140,0.75))"
      : "rgba(0,0,0,0.18)",
    color: "#e6edf5",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
  });

  const mono = {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.22)",
    fontSize: 12,
    opacity: 0.9,
    overflowX: "auto",
  };

  return (
    <div style={page}>
      <Header />

      <div style={wrap}>
        <div style={card}>
          <h1 style={h1}>ADMIN PANEL</h1>
          <p style={p}>
            This is the internal admin area. If you can read this, the <b>/admin</b> route is wired
            correctly.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btn(true)} onClick={() => nav("/dashboard")}>
              Back to Control Center
            </button>
            <button style={btn(false)} onClick={() => nav("/how-it-works")}>
              How It Works
            </button>
          </div>

          <div style={mono}>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Debug</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{JSON.stringify(
  {
    route: loc.pathname,
    email,
    authorized: authorized ? "YES" : "NO",
    note:
      "If clicking Admin still shows Home, your deploy/caching is serving an older bundle or the route isn’t being reached.",
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
