import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const onToggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* LEFT SIDE INTENTIONALLY EMPTY — tiny logo removed */}
        <div aria-hidden="true" />

        {/* RIGHT: clean nav + theme switch */}
        <nav className="row-actions">
          <Link className="btn" to="/">Home</Link>
          <Link className="btn" to="/login">Log In</Link>
          <Link className="btn" to="/join">Request Access</Link>
          <button
            className="theme-toggle"
            onClick={onToggle}
            type="button"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <span>Light</span><span className="toggle-sep">/</span><span>Dark</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
