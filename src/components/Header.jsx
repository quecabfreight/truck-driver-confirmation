// /src/components/Header.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function getAuthEmail() {
  try {
    return (localStorage.getItem(LS_EMAIL) || "").trim();
  } catch {
    return "";
  }
}

export default function Header() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState(() => getAuthEmail());

  // Keep header in sync with localStorage + route changes
  useEffect(() => {
    setEmail(getAuthEmail());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.pathname]);

  // Sync across tabs/windows too
  useEffect(() => {
    function onStorage(e) {
      if (!e) return;
      if (e.key === LS_EMAIL || e.key == null) {
        setEmail(getAuthEmail());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const authorized = useMemo(() => {
    return !!email && isBrokerOrShipper(email);
  }, [email]);

  function logout() {
    try {
      localStorage.removeItem(LS_EMAIL);

      // Clear common auth leftovers (safe even if unused)
      localStorage.removeItem("qc_access_code");
      localStorage.removeItem("qc_role");
      localStorage.removeItem("access_code");
      localStorage.removeItem("role");
      localStorage.removeItem("remember_device");
    } catch {}

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
          {/* Optional logo: if you have /public/qc-logo.png this will show it */}
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ width: 34, height: 34, objectFit: "contain" }}
            onError={(e) => {
              // If logo missing, hide the broken image icon cleanly
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
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
