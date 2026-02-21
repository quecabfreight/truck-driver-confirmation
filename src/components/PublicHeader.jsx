// /src/components/PublicHeader.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LS_EMAIL, getAuthEmail, isBrokerOrShipper, clearAuth } from "../utils/auth.js";

export default function PublicHeader() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState(() => getAuthEmail());

  // Keep header synced in the SAME tab (storage event doesn't fire in the same tab)
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = getAuthEmail();
      setEmail((prev) => (prev === current ? prev : current));
    };

    tick();
    const id = setInterval(tick, 500);

    const onStorage = (e) => {
      if (!e) return;
      if (e.key === LS_EMAIL || e.key == null) tick();
    };
    window.addEventListener("storage", onStorage);

    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [loc.pathname]);

  const authorized = useMemo(() => {
    const e = String(email || "").trim();
    return !!e && isBrokerOrShipper(e);
  }, [email]);

  function logout() {
    clearAuth();
    setEmail("");
    nav("/login", { replace: true });
  }

  const wrap = {
    position: "sticky",
    top: 0,
    zIndex: 60,
    background: "rgba(8, 12, 18, 0.78)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(140,190,255,0.12)",
  };

  const inner = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const brand = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    userSelect: "none",
  };

  const title = { fontSize: 15, fontWeight: 950, letterSpacing: 0.2 };
  const sub = { fontSize: 12, opacity: 0.72, marginTop: 2 };

  const navRow = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const btn = (primary) => ({
    padding: "10px 12px",
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

  const link = (label, onClick, primary = false) => (
    <button key={label} style={btn(primary)} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <div style={wrap}>
      <div style={inner}>
        <div
          style={brand}
          onClick={() => nav(authorized ? "/dashboard" : "/", { replace: false })}
          title="QueCab AdbS"
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ width: 34, height: 34, objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <div style={title}>QueCab AdbS</div>
            <div style={sub}>
              {authorized ? "Authorized" : "Public"} • Truck-Driver verification
            </div>
          </div>
        </div>

        <div style={navRow}>
          {authorized ? (
            <>
              {link("Control Center", () => nav("/dashboard"), true)}
              {link("How It Works", () => nav("/how-it-works"))}
              {link("Log Out", logout)}
            </>
          ) : (
            <>
              {link("Home", () => nav("/"), true)}
              {link("How It Works", () => nav("/how-it-works"))}
              {link("Log In", () => nav("/login"))}
              {link("Request Access", () => nav("/join"))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
