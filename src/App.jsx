import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages (must exist in src/pages/)
import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";

// If you don’t have this file yet, we’ll add it next.
// For now it can exist OR you can delete the /how-it-works route below.
import HowItWorks from "./pages/HowItWorks.jsx";

export default function App() {
  return (
    <Routes>
      {/* Main */}
      <Route path="/" element={<Home />} />

      {/* Phase 1 */}
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />
      <Route path="/how-it-works" element={<HowItWorks />} />

      {/* Safety net */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
