import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

function Placeholder({ label }) {
  return (
    <div className="qc-shell">
      <div className="qc-inner">
        <h1 className="qc-heading">{label}</h1>
        <p className="qc-sub">
          This screen will be wired in Phase 2. For now, use the Home page to
          describe QueCab AdbS and the Truck-Driver verification flow.
        </p>
        <Link to="/" className="qc-btn-primary">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("qc-theme") || "dark";
  });

  useEffect(() => {
    document.body.classList.remove("qc-theme-dark", "qc-theme-light");
    document.body.classList.add(theme === "light" ? "qc-theme-light" : "qc-theme-dark");
    localStorage.setItem("qc-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="qc-app">
      <header className="qc-header">
        <div className="qc-header-left">
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS logo"
            className="qc-logo"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="qc-title-block">
            <div className="qc-title-main">QueCab AdbS</div>
            <div className="qc-title-sub">Truck-Driver Confirmation</div>
          </div>
        </div>

        <div className="qc-header-right">
          <button
            type="button"
            className="qc-toggle"
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
          >
            <span className="qc-toggle-thumb" />
            <span className="qc-toggle-label">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </header>

      <main className="qc-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Placeholder label="Login (Coming Next)" />} />
          <Route path="/join" element={<Placeholder label="Request Access (Coming Next)" />} />
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
