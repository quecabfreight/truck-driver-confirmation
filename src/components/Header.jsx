import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LS_EMAIL = "adbs_login_email";
const LS_CODE = "adbs_login_code";
const LS_REMEMBER = "adbs_login_remember";

function isAuthed() {
  const remembered = localStorage.getItem(LS_REMEMBER) === "true";
  const email = (localStorage.getItem(LS_EMAIL) || "").trim();
  const code = (localStorage.getItem(LS_CODE) || "").trim();
  return remembered && !!email && !!code;
}

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const is = (p) => (location.pathname === p ? "active" : "");

  const [allowed, setAllowed] = useState(isAuthed());

  useEffect(() => {
    // update if login state changes (even in another tab)
    const onStorage = () => setAllowed(isAuthed());
    window.addEventListener("storage", onStorage);
    // also re-check when route changes
    setAllowed(isAuthed());
    return () => window.removeEventListener("storage", onStorage);
  }, [location.pathname]);

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className={`nav-link ${is("/")}`}>Home</Link>
        <Link to="/login" className={`nav-link ${is("/login")}`}>Log In</Link>
        <Link to="/join" className={`nav-link ${is("/join")}`}>Request Access</Link>
        <Link to="/about" className={`nav-link ${is("/about")}`}>About</Link>
        {allowed && (
          <Link to="/smart" className={`nav-link ${is("/smart")}`}>Check In Link</Link>
        )}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
