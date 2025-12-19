import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

function navClass({ isActive }) {
  return `qc-nav-link ${isActive ? "active" : ""}`;
}

export default function Layout() {
  return (
    <div className="qc-app">
      <header className="qc-header">
        <div className="qc-header-left">
          <Link to="/" className="qc-logo-wrap" aria-label="QueCab AdbS Home">
            <img src="/qc-logo.png" alt="QueCab AdbS" className="qc-logo" />
          </Link>

          <div className="qc-title-block">
            <div className="qc-title-main">QueCab AdbS</div>
            <div className="qc-title-sub">Secure Your Load</div>
          </div>
        </div>

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
          <NavLink to="/join" className="qc-nav-link qc-nav-link-cta">
            Request Access
          </NavLink>
        </nav>
      </header>

      <main className="qc-main">
        <Outlet />
      </main>
    </div>
  );
}
