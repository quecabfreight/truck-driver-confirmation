import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Clean header:
 * - No tiny top-left logo (removed as requested)
 * - Bigger nav buttons (24pt)
 * - Light/Dark toggle persists
 */
export default function Header() {
  const location = useLocation();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    // apply theme class on <body>
    document.body.classList.remove("theme-dark", "theme-light", "dark", "light");
    document.body.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const NavButton = ({ to, children }) => (
    <Link to={to} className="btn" aria-current={location.pathname === to ? "page" : undefined}>
      {children}
    </Link>
  );

  return (
    <header style={{padding:"14px 16px", position:"sticky", top:0, zIndex:50}}>
      <div className="qc-nav">
        <NavButton to="/">Home</NavButton>
        <NavButton to="/login">Log In</NavButton>
        <NavButton to="/join">Request Access</NavButton>
        <button className="btn" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
