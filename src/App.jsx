import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

// PUBLIC SITE PAGES (you already have these)
import PublicHome from "./pages/PublicHome";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import Join from "./pages/Join";

// PLATFORM / APP PAGES (you already have these)
import Home from "./pages/Home";
import ControlCenter from "./pages/ControlCenter";
import Admin from "./pages/Admin";

// VERIFY / DOCK FLOW (you already have these)
import Verify from "./pages/Verify";
import VerifyDriver from "./pages/VerifyDriver";
import CheckIn from "./pages/CheckIn";
import DriverCheckIn from "./pages/DriverCheckIn";
import DriverScreen from "./pages/DriverScreen";
import DriverLink from "./pages/DriverLink";
import DriverPing from "./pages/DriverPing";

// LEGACY / UTIL (you already have these)
import SmartLink from "./pages/SmartLink";
import PublicSite from "./pages/PublicSite";
import Site from "./pages/Site";
import SiteLanding from "./pages/SiteLanding";
import Website from "./pages/Website";
import LoginScreen from "./pages/LoginScreen";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* =========================
            PUBLIC LAYER (MARKETING)
            Default: PublicHome
        ========================== */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />

        {/* Keep these public entry points */}
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* =========================
            PLATFORM LAYER (APP)
            After login you should redirect to /control-center (we’ll wire that in Login.jsx next)
        ========================== */}
        <Route path="/home" element={<Home />} />

        {/* Main operational landing (Issue Verify Link / Control Center) */}
        <Route path="/control-center" element={<ControlCenter />} />

        {/* Back-compat: if anything points to dashboard, send it to Control Center */}
        <Route path="/dashboard" element={<Navigate to="/control-center" replace />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />

        {/* =========================
            VERIFY / DOCK ROUTES
        ========================== */}
        <Route path="/verify/:token" element={<Verify />} />

        {/* Back-compat / alternate verify page you already have */}
        <Route path="/verify-driver/:token" element={<VerifyDriver />} />

        {/* Other operational pages you already have */}
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/driver-checkin" element={<DriverCheckIn />} />
        <Route path="/driver-screen" element={<DriverScreen />} />
        <Route path="/driver-link" element={<DriverLink />} />
        <Route path="/driver-ping" element={<DriverPing />} />

        {/* =========================
            LEGACY / OLD SITE ROUTES
            (Kept so nothing breaks)
        ========================== */}
        <Route path="/smartlink" element={<SmartLink />} />
        <Route path="/publicsite" element={<PublicSite />} />
        <Route path="/site" element={<Site />} />
        <Route path="/site-landing" element={<SiteLanding />} />
        <Route path="/website" element={<Website />} />
        <Route path="/loginscreen" element={<LoginScreen />} />

        {/* =========================
            FALLBACK
        ========================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
