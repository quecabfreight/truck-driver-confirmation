import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Join from "./pages/Join";
import VerifyDriver from "./pages/VerifyDriver";
import ControlCenter from "./pages/ControlCenter";

const linkStyle = {
  color: "#e5e7eb",
  textDecoration: "none",
  fontWeight: 500,
};

function AppLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #1e293b 0%, #020617 55%, #000000 100%)",
        color: "#e5e7eb",
      }}
    >
      {/* TOP NAV */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid rgba(148,163,184,0.35)",
          background: "rgba(2,6,23,0.96)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* LOGO (clickable back to Home) */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={{ height: "44px", width: "auto" }}
          />
        </Link>

        {/* NAV LINKS */}
        <nav
          style={{
            display: "flex",
            gap: "24px",
            fontSize: "18px",
          }}
        >
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
      <main
        style={{
          padding: "32px 24px 40px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />

        {/* HOW IT WORKS */}
        <Route
          path="/how-it-works"
          element={
            <AppLayout>
              <HowItWorks />
            </AppLayout>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />

        {/* REQUEST ACCESS / JOIN */}
        <Route
          path="/join"
          element={
            <AppLayout>
              <Join />
            </AppLayout>
          }
        />

        {/* TRUCK-DRIVER VERIFY DISPLAY */}
        <Route
          path="/verify/:token"
          element={
            <AppLayout>
              <VerifyDriver />
            </AppLayout>
          }
        />

        {/* CONTROL CENTER (demo) */}
        <Route
          path="/control-center"
          element={
            <AppLayout>
              <ControlCenter />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}
