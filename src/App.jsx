import { Routes, Route, Link } from "react-router-dom";

// Page components
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Join from "./pages/Join";
import ControlCenter from "./pages/ControlCenter";
import Verify from "./pages/Verify"; // Make sure src/pages/Verify.jsx exists

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #050814 0%, #0b0f19 40%, #131e33 100%)",
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
            style={{ width: "54px", height: "54px", objectFit: "contain" }}
          />
          <span style={{ fontSize: "22px", fontWeight: 700 }}>QueCab AdbS</span>
        </div>

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
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Routes>
      </main>
    </div>
  );
}

// Shared nav link style
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
};

export default App;
