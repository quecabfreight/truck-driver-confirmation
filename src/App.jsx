import React from "react";
import { HashRouter, Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import Site from "./pages/Site.jsx";   // In case your public pages use it

// Header stays exactly as your site currently displays it
function Header() {
  return (
    <header className="qc-header">
      <div className="qc-header-inner">
        <NavLink to="/" className="qc-logo-link">
          <img src="/qc-logo.png" alt="QueCab AdbS" className="qc-logo" />
          <div className="qc-logo-text">
            <div className="qc-logo-title">QueCab AdbS</div>
            <div className="qc-logo-sub">Truck-Driver Confirmation</div>
          </div>
        </NavLink>

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
          <NavLink to="/join" className="qc-nav-btn">
            Request Access
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/join" element={<Join />} />
        <Route path="/control-center" element={<ControlCenter />} />

        {/* 🔥 The important one — THIS wires the Truck-Driver Verify page */}
        <Route path="/verify/:token" element={<VerifyDriver />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <div className="qc-shell qc-inner qc-notfound">
              <h1 className="qc-heading">Not Found</h1>
              <p className="qc-sub">
                This page does not exist or is not yet wired.
              </p>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}
