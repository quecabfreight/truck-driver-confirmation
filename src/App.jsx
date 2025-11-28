import React from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Join from "./pages/Join";
import LoginScreen from "./pages/LoginScreen";
import ControlCenter from "./pages/ControlCenter";

function Placeholder({ label }) {
  return (
    <div className="qc-shell">
      <div className="qc-inner">
        <h1 className="qc-heading">{label}</h1>
        <p className="qc-sub">
          This screen will be wired in the next phase. For now, use the Home
          and How It Works pages to present QueCab AdbS and Truck-Driver
          Confirmation.
        </p>
        <Link to="/" className="qc-btn-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="qc-app">
      <header className="qc-header">
        <div className="qc-header-left">
          <Link to="/" className="qc-logo-wrap">
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS logo"
              className="qc-logo"
            />
          </Link>
          <div className="qc-title-block">
            <div className="qc-title-main">QueCab AdbS</div>
            <div className="qc-title-sub">Truck-Driver Confirmation</div>
          </div>
        </div>

        <nav className="qc-nav">
          <NavLink to="/" end className="qc-nav-link">
            Home
          </NavLink>
          <NavLink to="/how-it-works" className="qc-nav-link">
            How It Works
          </NavLink>
          <NavLink to="/login" className="qc-nav-link">
            Log In
          </NavLink>
          <NavLink to="/join" className="qc-nav-link qc-nav-link-cta">
            Request Access
          </NavLink>
        </nav>
      </header>

      <main className="qc-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="*" element={<Placeholder label="Not Found" />} />
        </Routes>
      </main>

      <footer className="qc-footer">
        <span>© {new Date().getFullYear()} QueCab Inc. — QueCab AdbS</span>
        <span className="qc-footer-links">
          <a href="#about">About</a>
          <span>•</span>
          <a href="#contact">Contact</a>
        </span>
      </footer>
    </div>
  );
}
