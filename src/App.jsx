import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import VerifyDriver from "./pages/VerifyDriver";
import DriverScreen from "./pages/DriverScreen";
import SmartLink from "./pages/SmartLink";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/verify/:token" element={<VerifyDriver />} />
        <Route path="/s/:token" element={<DriverScreen />} />
        <Route path="/smart" element={<SmartLink />} />
        {/* Fallback: render Home for any unknown route */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  );
}
