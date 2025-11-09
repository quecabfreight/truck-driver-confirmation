import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import BugButton from "./components/BugButton";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import SmartLink from "./pages/SmartLink";
import VerifyDriver from "./pages/VerifyDriver";
import DriverScreen from "./pages/DriverScreen";
import About from "./pages/About";

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggleTheme };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ minHeight: "calc(100vh - 180px)" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/about" element={<About />} />
          <Route path="/smart" element={<SmartLink />} />
          <Route path="/verify/:token" element={<VerifyDriver />} />
          <Route path="/s/:token" element={<DriverScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BugButton />
    </HashRouter>
  );
}
