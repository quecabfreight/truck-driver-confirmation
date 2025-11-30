import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC PAGES */}
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/join" element={<Join />} />
      <Route path="/login" element={<Login />} />

      {/* DEMO CONTROL CENTER */}
      <Route path="/control-center" element={<ControlCenter />} />

      {/* TRUCK-DRIVER VERIFY LINK (DEMO) */}
      <Route path="/verify/:token" element={<VerifyDriver />} />

      {/* FALLBACK – SEND ANY RANDOM URL BACK HOME */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
