import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }) {
  return `qc-navlink ${isActive ? "qc-navlink-active" : ""}`;
}

export default function Layout() {
  return (
    <div className="qc-app">
      <header className="qc-topbar">
        <div className="qc-topbar-inner">
          {/* LOGO → HOME */}
          <Link to="/" className="qc-brand" aria-label="QueCab AdbS Home">
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              className="qc-brand-logo"
            />
          </Link>

          {/* NAV */}
          <nav className="qc-nav" aria-label="Primary navigation">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/how-it-works" className={navClass}>
              How It Works
            </NavLink>
            <NavLink to="/login" className={navClass}>
              Log In
            </NavLink>
            <NavLink to="/join" className="qc-navbtn">
              Request Access
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="qc-main">
        <Outlet />
      </main>
    </div>
  );
}
