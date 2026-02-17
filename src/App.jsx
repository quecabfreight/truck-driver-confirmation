import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login";
import Join from "./pages/Join";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";
import Home from "./pages/Home"; // Using existing Home as Dashboard

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
            PLATFORM LAYER
        ========================== */}

        <Route path="/dashboard" element={<Home />} />
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
