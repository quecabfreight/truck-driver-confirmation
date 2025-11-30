import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles/header.css"; // if you have header styles

export default function Header() {
  return (
    <header className="qc-header">
      <div className="qc-header-inner">

        {/* LOGO — ALWAYS RETURNS TO HOME */}
        <Link to="/" className="qc-logo-link">
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            className="qc-logo"
          />
        </Link>

        {/* NAV LINKS */}
        <nav className="qc-nav">
          <NavLink to="/" className="qc-nav-item">
            Home
          </NavLink>

          <NavLink to="/how-it-works" className="qc-nav-item">
            How It Works
          </NavLink>

          <NavLink to="/login" className="qc-nav-item">
            Log In
          </NavLink>

          <NavLink to="/join" className="qc-nav-item">
            Request Access
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
