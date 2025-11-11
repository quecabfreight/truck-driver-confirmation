// /src/components/Header.jsx — FULL OVERWRITE
import React, { useEffect, useState } from "react";

function setTheme(next) {
  const root = document.documentElement; // <html>
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("qc-theme", next); } catch {}
}

function getTheme() {
  try { return localStorage.getItem("qc-theme") || "dark"; } catch { return "dark"; }
}

export default function Header() {
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => { setTheme(theme); }, [theme]);

  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

  return (
    <header className="qc-header" style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px" }}>
      {/* Logo (220px governed by CSS on .qc-logo / #qc-logo) */}
      <a href="#/" className="qc-logo" id="qc-logo" style={{ display: "inline-block" }}>
        <img src="/qc-logo.png" alt="QueCab AdbS logo" />
      </a>

      {/* Nav tabs */}
      <nav className="nav" style={{ display: "flex", gap: 12, marginLeft: "auto", marginRight: 12 }}>
        <a href="#/" className="active">Home</a>
        <a href="#/join">Request Access</a>
        <a href="#/login">Log In</a>
        <a href="#/about">About</a>
        <a href="#/checkin">Check In</a>
      </nav>

      {/* Role pill (this is the “BROKER” you wanted styled) */}
      <span className="role-badge">BROKER</span>

      {/* Sun/Moon theme switch — DO NOT REMOVE */}
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="btn theme-toggle"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: "var(--ctrl-h)", padding: "0 16px", borderRadius: 14, border: "1px solid var(--panel-br)", background: "var(--panel-bg)", fontWeight: 800 }}
      >
        {theme === "dark" ? (
          // Sun icon
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M6.76 4.84l-1.8-1.79l1.41-1.41l1.79 1.8zM1 13h3v-2H1zm9-9h2V1h-2zm8.66 1.64l1.79-1.8l1.41 1.41l-1.8 1.79zM17.24 19.16l1.79 1.8l-1.41 1.41l-1.8-1.79zM20 13h3v-2h-3zM11 23h2v-3h-2zM4.22 18.36l-1.8 1.79l1.41 1.41l1.79-1.8zM12 6a6 6 0 1 1 0 12a6 6 0 0 1 0-12z"/>
          </svg>
        ) : (
          // Moon icon
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12.99 2.04a9 9 0 1 0 9 9a7.5 7.5 0 0 1-9-9z"/>
          </svg>
        )}
        <span style={{ marginLeft: 10, fontWeight: 800 }}>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
    </header>
  );
}
