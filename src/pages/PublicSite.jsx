// /src/pages/PublicSite.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAuthEmail, isAuthorized, LS_EMAIL } from "../utils/auth.js";

export default function PublicSite() {
  const nav = useNavigate();
  const [email, setEmail] = useState(() => getAuthEmail());

  // Keep in sync in the same tab (storage event does NOT fire in the same tab)
  useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const current = getAuthEmail();
      setEmail((prev) => (prev === current ? prev : current));
    };

    tick();
    const id = setInterval(tick, 1000);

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
  }, []);

  const authorized = useMemo(() => isAuthorized(), [email]);

  const page = {
    background: "#0f1722",
    color: "#e6edf5",
    minHeight: "100vh",
  };

  const btnPrimary = {
    padding: "14px 18px",
    fontSize: 16,
    fontWeight: 800,
    background: "#1f3b63",
    border: "1px solid #2e5a96",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
  };

  const btnGhost = {
    padding: "14px 18px",
    fontSize: 16,
    fontWeight: 800,
    background: "transparent",
    border: "1px solid #2e5a96",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
  };

  function logout() {
    try {
      localStorage.removeItem(LS_EMAIL);
      localStorage.removeItem("qc_access_code");
      localStorage.removeItem("qc_role");
      localStorage.removeItem("access_code");
      localStorage.removeItem("role");
      localStorage.removeItem("remember_device");
    } catch {}
    setEmail("");
    nav("/login", { replace: true });
  }

  return (
    <div style={page}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
          QueCab AdbS — Public Site
        </h1>

        <p style={{ fontSize: 18, opacity: 0.8, maxWidth: 800 }}>
          Placeholder page reserved for future public-site layout work. The main public homepage is
          located at <b>/#/</b>.
        </p>

        <div style={{ marginTop: 10, fontSize: 14, opacity: 0.85 }}>
          {authorized ? (
            <>
              Signed in as <b>{email}</b>.
            </>
          ) : (
            <>Not signed in.</>
          )}
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
          <button onClick={() => nav("/")} style={btnPrimary}>
            Go to Homepage
          </button>

          {authorized ? (
            <>
              <button onClick={() => nav("/dashboard")} style={btnGhost}>
                Control Center
              </button>
              <button onClick={logout} style={btnGhost}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => nav("/login")} style={btnGhost}>
                Log In
              </button>

              <button onClick={() => nav("/join")} style={btnGhost}>
                Request Access
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 26, opacity: 0.7, fontSize: 14 }}>
          Build-safe placeholder to prevent deploy failures.
        </div>
      </div>
    </div>
  );
}
