import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import DriverScreen from "./pages/DriverScreen.jsx";
import SmartLink from "./pages/SmartLink.jsx";

export default function App() {
  // Apply persisted theme on first paint (dark default)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const root = document.documentElement;
    if (saved === "light") root.classList.remove("dark");
    else root.classList.add("dark");
  }, []);

  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/verify/:token" element={<VerifyDriver />} />
        <Route path="/s/:token" element={<DriverScreen />} />
        <Route path="/smart" element={<SmartLink />} />
        {/* No Navigate fallback to avoid router version quirks */}
      </Routes>
      <Footer />
    </HashRouter>
  );
}
