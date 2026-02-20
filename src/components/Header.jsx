// /src/components/Header.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LS_EMAIL, getAuthEmail, isAuthorized, clearAuth } from "../utils/auth.js";

export default function Header() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState(() => getAuthEmail());

  // Same-tab sync (storage event won't fire in same tab)
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = getAuthEmail();
      setEmail((prev) => (prev === current ? prev : current));
    };

    tick();
    const id = setInterval(tick, 500);

    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);

    // Cross-tab
    const onStorage = (e) => {
      if (!e) return;
      if (e.key === LS_EMAIL || e.key == null) tick();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, [loc.pathname]);

  const authorized = useMemo(() => {
    // Use the shared truth (not local guesses)
    return isAuthorized();
  }, [email, loc.pathname]);

  function logout() {
    clearAuth();
    setEmail("");
    nav("/login", { replace: true });
  }

  const wrap = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(10px)",
    background: "rgba(8, 12, 18, 0.78)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  };

  const inner = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const brand = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    userSelect: "none",
  };

  const title = { fontWeight: 900, letterSpacing: 0.2, fontSize: 16 };
  const sub = { fontSize: 12, opacity: 0.72, marginTop: 2 };

  const btn = (primary) => ({
    padding: "10px 12px",
    borderRadius: 12,
    border: primary
      ? "1px solid rgba(120,180,255,0.45)"
      : "1px solid rgba(255,255,255,0.16)",
    background: primary ? "rgba(40, 110, 190, 0.35)" : "rgba(255,255,255,0.06)",
    color: "inherit",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

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
              {authorized ? "Authorized Control Center" : "Truck-Driver verification system"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {authorized ? (
            <>
              <button style={btn(false)} onClick={() => nav("/dashboard")}>
                Control Center
              </button>
              <button style={btn(true)} onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button style={btn(false)} onClick={() => nav("/join")}>
                Request Access
              </button>
              <button style={btn(true)} onClick={() => nav("/login")}>
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
