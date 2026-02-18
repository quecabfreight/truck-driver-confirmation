import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function isAuthed() {
  try {
    const raw = localStorage.getItem("adbs_auth");
    const j = raw ? JSON.parse(raw) : null;
    return !!j?.ok;
  } catch {
    return false;
  }
}

export default function Header() {
  const nav = useNavigate();
  const loc = useLocation();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
    function onStorage(e) {
      if (e.key === "adbs_auth") setAuthed(isAuthed());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const items = authed
    ? [
        { label: "Control Center", path: "/dashboard" },
        { label: "Admin", path: "/admin" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "How It Works", path: "/how-it-works" },
        { label: "Log In", path: "/login" },
        { label: "Request Access", path: "/join" },
      ];

  function isActive(path) {
    if (path === "/") return loc.pathname === "/";
    return loc.pathname.startsWith(path);
  }

  return (
    <header style={styles.wrap}>
      <div style={styles.inner}>
        <button style={styles.brandBtn} onClick={() => nav("/")}>
          <img src="/qc-logo.png" alt="QueCab AdbS" style={styles.logo} draggable={false} />
          <div style={styles.brandText}>
            <div style={styles.brandTop}>Anti-Double Brokering System</div>
            <div style={styles.brandSub}>Verification happens before freight moves.</div>
          </div>
        </button>

        <nav style={styles.nav}>
          {items.map((it) => (
            <button
              key={it.path}
              style={{ ...styles.navBtn, ...(isActive(it.path) ? styles.navBtnActive : null) }}
              onClick={() => nav(it.path)}
            >
              {it.label}
            </button>
          ))}

          {authed ? (
            <button
              style={{ ...styles.navBtn, ...styles.navBtnDanger }}
              onClick={() => {
                localStorage.removeItem("adbs_auth");
                setAuthed(false);
                nav("/");
              }}
            >
              Log Out
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  wrap: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(9, 13, 20, 0.72)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(140,190,255,0.12)",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },

  brandBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  },
  logo: { width: 220, height: "auto" },
  brandText: { lineHeight: 1.1 },
  brandTop: { fontWeight: 950, letterSpacing: 0.2, opacity: 0.95 },
  brandSub: { marginTop: 4, opacity: 0.72, fontWeight: 800, fontSize: 13 },

  nav: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  navBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 950,
    letterSpacing: 0.2,
    color: "rgba(230,237,245,0.92)",
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(140,190,255,0.16)",
  },
  navBtnActive: {
    border: "1px solid rgba(140,190,255,0.42)",
    background: "linear-gradient(180deg, rgba(40,110,200,0.22), rgba(0,0,0,0.22))",
  },
  navBtnDanger: {
    border: "1px solid rgba(255,120,120,0.30)",
    background: "rgba(120,0,0,0.16)",
  },
};
