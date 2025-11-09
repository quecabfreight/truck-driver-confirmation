import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAuthed, isBrokerOrShipper } from "../utils/auth";

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const is = (p) => (location.pathname === p ? "active" : "");

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const update = () => setAllowed(isBrokerOrShipper());
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, [location.pathname]);

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className={`nav-link ${is("/")}`}>Home</Link>
        <Link to="/login" className={`nav-link ${is("/login")}`}>{isAuthed() ? "Switch User" : "Log In"}</Link>
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
