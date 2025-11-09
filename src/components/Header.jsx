import React from "react";
import { Link, useLocation } from "react-router-dom";

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const is = (p) => (location.pathname === p ? "active" : "");

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className={`nav-link ${is("/")}`}>Home</Link>
        <Link to="/login" className={`nav-link ${is("/login")}`}>Log In</Link>
        <Link to="/join" className={`nav-link ${is("/join")}`}>Request Access</Link>
        <Link to="/about" className={`nav-link ${is("/about")}`}>About</Link>
        <Link to="/smart" className={`nav-link ${is("/smart")}`}>Check In Link</Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
