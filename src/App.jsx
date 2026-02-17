import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

/* PUBLIC */
import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login";
import Join from "./pages/Join";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

/* PLATFORM */
import Home from "./pages/Home";
import ControlCenter from "./pages/ControlCenter";
import Admin from "./pages/Admin";

/* VERIFY */
import Verify from "./pages/Verify";
import VerifyDriver from "./pages/VerifyDriver";

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

        {/* PLATFORM */}
        <Route path="/home" element={<Home />} />
        <Route path="/control-center" element={<ControlCenter />} />
        <Route path="/dashboard" element={<Navigate to="/control-center" replace />} />
        <Route path="/admin" element={<Admin />} />

        {/* VERIFY */}
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/verify-driver/:token" element={<VerifyDriver />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
