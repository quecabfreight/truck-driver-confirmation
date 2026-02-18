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

import SmartLink from "./pages/SmartLink";
import DriverLink from "./pages/DriverLink";

import PublicScaffold from "./components/PublicScaffold";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/join"
          element={
            <PublicScaffold>
              <Join />
            </PublicScaffold>
          }
        />

        {/* LEGACY SAFETY NET */}
        <Route path="/home" element={<Home />} />

        {/* PLATFORM */}
        <Route path="/dashboard" element={<ControlCenter />} />
        <Route path="/admin" element={<Admin />} />

        {/* ISSUER SCREENS (EXISTING PAGES) */}
        <Route path="/smartlink" element={<SmartLink />} />
        <Route path="/driverlink" element={<DriverLink />} />

        {/* VERIFY */}
        <Route path="/verify/:token" element={<Verify />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
