import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import DriverCheckIn from "./pages/DriverCheckIn.jsx";
import SmartLink from "./pages/SmartLink.jsx";

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefers = saved || "dark";
    document.documentElement.classList.toggle("dark", prefers === "dark");
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/verify/:token" element={<VerifyDriver />} />
          <Route path="/s/:token" element={<DriverCheckIn />} />
          <Route path="/panel" element={<SmartLink />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div>© {new Date().getFullYear()} QueCab AdbS</div>
      </footer>
    </div>
  );
}
