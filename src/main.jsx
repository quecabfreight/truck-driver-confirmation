// /src/App.jsx
import React from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import Verify from "./pages/Verify.jsx";
import Admin from "./pages/Admin.jsx";

import { isBrokerOrShipper, LS_EMAIL } from "./utils/auth.js";

function RequireAuth({ children }) {
  const loc = useLocation();
  const email = (localStorage.getItem(LS_EMAIL) || "").trim();

  if (!email || !isBrokerOrShipper(email)) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />

        {/* PUBLIC verify link (NO LOGIN REQUIRED) */}
        <Route path="/verify/:token" element={<Verify />} />

        {/* Authorized */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <ControlCenter />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />

        {/* Legacy routes: keep hidden */}
        <Route path="/smartlink" element={<Navigate to="/dashboard" replace />} />
        <Route path="/driverlink" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
