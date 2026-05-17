import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import Admin from "./pages/Admin.jsx";
import Feedback from "./pages/Feedback.jsx";
import LiveActivity from "./pages/LiveActivity.jsx";
import LiveSessions from "./pages/LiveSessions.jsx";
import Account from "./pages/Account.jsx";
import BetaNotice from "./pages/BetaNotice.jsx";

import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<ControlCenter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/activity" element={<LiveActivity />} />
            <Route path="/live" element={<LiveSessions />} />
            <Route path="/account" element={<Account />} />
            <Route path="/beta-notice" element={<BetaNotice />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
