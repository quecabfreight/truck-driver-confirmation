import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import DriverLink from "./pages/DriverLink.jsx";

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
};

export default function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
          color: "white",
        }}
      >
        {/* TOP NAV BAR */}
        <header
          style={{
            padding: "18px 48px",
            borderBottom: "1px solid rgba(148,163,184,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo + title link back Home */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textDecoration: "none",
              color: "white",
            }}
          >
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS Logo"
              style={{ width: "54px", height: "54px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "22px", fontWeight: 700 }}>
              QueCab AdbS
            </span>
          </Link>

          <nav
            style={{
              display: "flex",
              gap: "26px",
              fontSize: "18px",
              fontWeight: 500,
            }}
          >
            <Link to="/" style={navLinkStyle}>
              Home
            </Link>
            <Link to="/how-it-works" style={navLinkStyle}>
              How It Works
            </Link>
            <Link to="/login" style={navLinkStyle}>
              Log In
            </Link>
            <Link to="/join" style={navLinkStyle}>
              Request Access
            </Link>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: "32px 24px 48px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/control-center" element={<ControlCenter />} />
            <Route path="/verify/:token" element={<VerifyDriver />} />
            <Route path="/driver/:token" element={<DriverLink />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
