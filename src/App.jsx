import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import LoginScreen from "./pages/LoginScreen.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

// Top navigation / logo bar – same look you already have
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

// Simple fallback screen if someone hits a bad URL
function NotFound() {
  return (
    <div className="qc-shell qc-inner qc-notfound">
      <h1 className="qc-heading">Not Found</h1>
      <p className="qc-sub">
        This page does not exist or is not yet wired in this demo build.
      </p>
    </div>
  );
}

export default function App() {
  // NOTE: The router (HashRouter) is already set up in main.jsx.
  // Here we ONLY define the routes and render the pages.
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/join" element={<Join />} />
        <Route path="/control-center" element={<ControlCenter />} />

        {/* 🔥 This wires the Truck-Driver Verify screen */}
        <Route path="/verify/:token" element={<VerifyDriver />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
