// /src/App.jsx — FULL OVERWRITE
import React from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";

// keep your existing header + pages
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";

// NEW: our stand-alone landing page
import SiteLanding from "./pages/SiteLanding.jsx";

// optional: keep these routes if they exist
let CheckIn, Verify;
try { CheckIn = (await import("./pages/CheckIn.jsx")).default; } catch { CheckIn = () => null; }
try { Verify  = (await import("./pages/Verify.jsx")).default; } catch { Verify  = () => null; }

function DefaultLayout() {
  return (
    <div className="app-shell" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}

// NOTE: no Header here — this lets /site be truly full width.
function BareLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Stand-alone marketing site (no header wrapper) */}
        <Route element={<BareLayout />}>
          <Route path="/site" element={<SiteLanding />} />
        </Route>

        {/* Everything else uses your normal app layout */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/verify/:token" element={<Verify />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
