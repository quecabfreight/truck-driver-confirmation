import React from "react";
import { Routes, Route, Link } from "react-router-dom";

// Core pages that we know are present
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Join from "./pages/Join";
// We'll re-attach these once routing is confirmed working:
// import ControlCenter from "./pages/ControlCenter";
// import Verify from "./pages/Verify";

function App() {
  return (
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
            style={{ width: "58px", height: "58px" }}
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
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          {/* We'll re-enable these after sanity check */}
          {/* <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/verify/:token" element={<Verify />} /> */}
        </Routes>
      </main>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
};

export default App;
