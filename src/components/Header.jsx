// /src/components/Header.jsx — HEADER with colored Sun & Moon toggle
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

  const setDark  = () => setThemeState("dark");
  const setLight = () => setThemeState("light");

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

      {/* Row 2: role pill + COLORED theme toggle */}
      <div className="qc-header-tools">
        <span className="role-badge">BROKER</span>

        {/* Colored two-segment toggle — shows BOTH icons */}
        <div className="theme-toggle" role="group" aria-label="Theme">
          <button
            type="button"
            className={`theme-seg ${theme === "dark" ? "is-active" : ""}`}
            onClick={setDark}
            aria-pressed={theme === "dark"}
            aria-label="Dark theme"
            title="Dark"
          >
            <span className="icon-moon" aria-hidden="true">🌙</span>
            <span className="theme-text">Dark</span>
          </button>

          <button
            type="button"
            className={`theme-seg ${theme === "light" ? "is-active" : ""}`}
            onClick={setLight}
            aria-pressed={theme === "light"}
            aria-label="Light theme"
            title="Light"
          >
            <span className="icon-sun" aria-hidden="true">🌞</span>
            <span className="theme-text">Light</span>
          </button>
        </div>
      </div>
    </header>
  );
}
