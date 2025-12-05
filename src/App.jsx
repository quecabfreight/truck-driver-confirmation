import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";

// IMPORTANT: only import files we know exist
import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

export default function App() {
  return (
    <HashRouter>
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
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS Logo"
              style={{ width: "58px", height: "58px", objectFit: "contain" }}
            />
            <span style={{ fontSize: "24px", fontWeight: 700 }}>
              QueCab AdbS
            </span>
          </div>

          <nav style={{ display: "flex", gap: "26px", fontSize: "18px" }}>
            <Link to="/" style={linkStyle}>
              Home
            </Link>
            <Link to="/how-it-works" style={linkStyle}>
              How It Works
            </Link>
            <Link to="/login" style={linkStyle}>
              Log In
            </Link>
            <Link to="/join" style={linkStyle}>
              Request Access
            </Link>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        <main>
          <Routes>
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* HOW IT WORKS – for now, reuse Home */}
            <Route path="/how-it-works" element={<Home />} />

            {/* LOGIN */}
            <Route path="/login" element={<Login />} />

            {/* REQUEST ACCESS */}
            <Route path="/join" element={<Join />} />

            {/* CONTROL CENTER */}
            <Route path="/control-center" element={<ControlCenter />} />

            {/* TRUCK-DRIVER VERIFICATION */}
            <Route path="/verify/:token" element={<VerifyDriver />} />

            {/* FALLBACK */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
};
