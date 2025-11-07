import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// layout
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import DriverScreen from "./pages/DriverScreen.jsx";
import SmartLink from "./pages/SmartLink.jsx";

export default function App() {
  // Persist and apply theme on first paint
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const root = document.documentElement;
    if (saved === "light") root.classList.remove("dark");
    else root.classList.add("dark"); // default dark
  }, []);

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Broker/shipper request access */}
        <Route path="/join" element={<Join />} />

        {/* Dock and Driver flows */}
        <Route path="/verify/:token" element={<VerifyDriver />} />
        <Route path="/s/:token" element={<DriverScreen />} />

        {/* Broker panel placeholder: Smart Link generator */}
        <Route path="/smart" element={<SmartLink />} />

        {/* Fallback → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
