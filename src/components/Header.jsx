import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>Home</Link>
        <Link to="/login" className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}>Log In</Link>
        <Link to="/join" className={`nav-link ${location.pathname === "/join" ? "active" : ""}`}>Request Access</Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
