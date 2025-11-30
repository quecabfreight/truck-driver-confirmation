import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

export default function App() {
  const year = new Date().getFullYear();

  return (
    <Router>
      <div className="qc-app">
        {/* HEADER / NAV */}
        <header className="qc-header">
          <div className="qc-header-inner">
            <NavLink to="/" className="qc-logo-link">
              <img
                src="/qc-logo.png"
                alt="QueCab AdbS"
                className="qc-logo"
              />
            </NavLink>

            <nav className="qc-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "qc-nav-link" + (isActive ? " qc-nav-link-active" : "")
                }
                end
              >
                Home
              </NavLink>

              <NavLink
                to="/how-it-works"
                className={({ isActive }) =>
                  "qc-nav-link" + (isActive ? " qc-nav-link-active" : "")
                }
              >
                How It Works
              </NavLink>

              <NavLink
                to="/join"
                className={({ isActive }) =>
                  "qc-nav-link qc-nav-link-strong" +
                  (isActive ? " qc-nav-link-active" : "")
                }
              >
                Request Access
              </NavLink>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "qc-nav-link" + (isActive ? " qc-nav-link-active" : "")
                }
              >
                Log In
              </NavLink>
            </nav>
          </div>
        </header>

        {/* MAIN ROUTES */}
        <main className="qc-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify/:token" element={<VerifyDriver />} />
          </Routes>
        </main>

        {/* FOOTER / SUPPORT */}
        <footer className="qc-footer">
          <div className="qc-footer-inner">
            <p className="qc-footer-text">
              Need help with QueCab AdbS? Email{" "}
              <a href="mailto:support@quecabadbs.com">
                support@quecabadbs.com
              </a>
            </p>
            <p className="qc-footer-note">
              © {year} QueCab Inc. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
