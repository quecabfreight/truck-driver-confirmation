import React from "react";
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
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
