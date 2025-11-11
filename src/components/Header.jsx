// /src/components/Header.jsx — Single toggle (sun+moon), BROKER pill, centered nav
import React, { useEffect, useState } from "react";

function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("qc-theme", next); } catch {}
}
function getTheme() {
  try { return localStorage.getItem("qc-theme") || "dark"; } catch { return "dark"; }
}

export default function Header() {
  const [theme, setThemeState] = useState(getTheme());
  useEffect(() => { setTheme(theme); }, [theme]);

  const toggleTheme = () => setThemeState(t => (t === "dark" ? "light" : "dark"));

  return (
    <header className="qc-header" role="banner">
      {/* Row 1: nav tabs */}
      <nav className="qc-nav" aria-label="Primary">
        <a href="#/" className="active">Home</a>
        <a href="#/join">Request Access</a>
        <a href="#/login">Log In</a>
        <a href="#/about">About</a>
        <a href="#/checkin">Check In</a>
      </nav>

      {/* Row 2: BROKER pill + SINGLE colored toggle */}
      <div className="qc-header-tools">
        <span className="role-badge">BROKER</span>

        <button
          type="button"
          className="theme-toggle-single"
          onClick={toggleTheme}
          aria-pressed={theme === "light"}
          aria-label="Toggle theme"
        >
          <span className="icon sun" aria-hidden="true">🌞</span>
          <span className="knob" />
          <span className="icon moon" aria-hidden="true">🌙</span>
          <span className="theme-text">{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
      </div>
    </header>
  );
}
