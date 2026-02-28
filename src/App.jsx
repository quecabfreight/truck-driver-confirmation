// /src/App.jsx
import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import Verify from "./pages/Verify.jsx";
import Admin from "./pages/Admin.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";

import { ErrorBoundary, CrashOverlayListener, installGlobalCrashOverlay } from "./components/FatalErrorOverlay.jsx";

export default function App() {
  useEffect(() => {
    installGlobalCrashOverlay();
  }, []);

  return (
    <ErrorBoundary>
      <CrashOverlayListener />
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />

          {/* Verify must be PUBLIC */}
          <Route path="/verify/:token" element={<Verify />} />

          {/* Authorized */}
          <Route path="/dashboard" element={<ControlCenter />} />
          <Route path="/admin" element={<Admin />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
