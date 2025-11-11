import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import PublicSite from "./pages/PublicSite.jsx";

function Shell({ children }) {
  const location = useLocation();
  const hideHeader = location.pathname === "/site";
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {!hideHeader && <Header />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/site" element={<PublicSite />} />
        </Routes>
      </Shell>
    </HashRouter>
  );
}
