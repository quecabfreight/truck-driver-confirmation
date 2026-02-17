import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard"; // Issue Verify Link page (Control Center)

export default function App() {
  return (
    <HashRouter>
      <Routes>

        {/* =========================
            PUBLIC LAYER
        ========================== */}

        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* =========================
            PLATFORM LAYER (SECURE)
        ========================== */}

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/verify/:token" element={<Verify />} />

        {/* =========================
            FALLBACK
        ========================== */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </HashRouter>
  );
}
