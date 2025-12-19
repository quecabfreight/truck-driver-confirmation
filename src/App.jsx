import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="join" element={<Join />} />
          <Route path="login" element={<Login />} />
          <Route path="control-center" element={<ControlCenter />} />
          <Route path="*" element={<Home />} />
        </Route>

        {/* standalone verify route */}
        <Route path="/verify/:token" element={<VerifyDriver />} />
      </Routes>
    </HashRouter>
  );
}
