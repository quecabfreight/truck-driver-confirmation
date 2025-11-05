import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const loc = useLocation();
  const onToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <img src="/qc-logo.png" alt="QueCab AdbS" />
          <span>QueCab AdbS</span>
          <span className="tag">{loc.pathname}</span>
        </div>
        <nav className="row-actions">
          <Link className="btn" to="/">Home</Link>
          <Link className="btn" to="/login">Log In</Link>
          <Link className="btn" to="/join">Request Access</Link>
          <button className="theme-toggle" onClick={onToggle} type="button" aria-label="Toggle theme">
            <span>Light</span>/<span>Dark</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
