import React, { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * BUILD-SAFE ROUTER
 * - Hard-import only the core pages we need right now
 * - Lazy-load everything else so one bad export doesn't break deploy
 * - HashRouter preserved
 */

// Core (hard imports)
import PublicHome from "./pages/PublicHome";
import Login from "./pages/Login";
import Join from "./pages/Join";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Home from "./pages/Home";
import ControlCenter from "./pages/ControlCenter";
import Admin from "./pages/Admin";
import Verify from "./pages/Verify";

// Non-core (lazy imports) — won’t break the build unless visited
const VerifyDriver = lazy(() => import("./pages/VerifyDriver"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const DriverCheckIn = lazy(() => import("./pages/DriverCheckIn"));
const DriverScreen = lazy(() => import("./pages/DriverScreen"));
const DriverLink = lazy(() => import("./pages/DriverLink"));
const DriverPing = lazy(() => import("./pages/DriverPing"));
const SmartLink = lazy(() => import("./pages/SmartLink"));
const PublicSite = lazy(() => import("./pages/PublicSite"));
const Site = lazy(() => import("./pages/Site"));
const SiteLanding = lazy(() => import("./pages/SiteLanding"));
const Website = lazy(() => import("./pages/Website"));
const LoginScreen = lazy(() => import("./pages/LoginScreen"));

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1722",
        color: "#e6edf5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 700,
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* PUBLIC LAYER */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />

          {/* PLATFORM LAYER */}
          <Route path="/home" element={<Home />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="/dashboard" element={<Navigate to="/control-center" replace />} />
          <Route path="/admin" element={<Admin />} />

          {/* VERIFY / DOCK */}
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/verify-driver/:token" element={<VerifyDriver />} />

          {/* OTHER EXISTING PAGES (kept, but lazy) */}
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/driver-checkin" element={<DriverCheckIn />} />
          <Route path="/driver-screen" element={<DriverScreen />} />
          <Route path="/driver-link" element={<DriverLink />} />
          <Route path="/driver-ping" element={<DriverPing />} />

          {/* LEGACY / OLD SITE ROUTES (kept, but lazy) */}
          <Route path="/smartlink" element={<SmartLink />} />
          <Route path="/publicsite" element={<PublicSite />} />
          <Route path="/site" element={<Site />} />
          <Route path="/site-landing" element={<SiteLanding />} />
          <Route path="/website" element={<Website />} />
          <Route path="/loginscreen" element={<LoginScreen />} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
