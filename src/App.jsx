import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login";
import Join from "./pages/Join";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import ControlCenter from "./pages/ControlCenter";
import Home from "./pages/Home";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* LEGACY SAFETY NET */}
        <Route path="/home" element={<Home />} />

        {/* PLATFORM */}
        <Route path="/dashboard" element={<ControlCenter />} />
        <Route path="/admin" element={<Admin />} />

        {/* LEGACY ISSUER ROUTES (DO NOT EXPOSE UI) */}
        <Route path="/smartlink" element={<Navigate to="/dashboard" replace />} />
        <Route path="/driverlink" element={<Navigate to="/dashboard" replace />} />

        {/* VERIFY */}
        <Route path="/verify/:token" element={<Verify />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
