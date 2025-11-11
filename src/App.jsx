// /src/App.jsx — FULL OVERWRITE
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import CheckIn from "./pages/CheckIn.jsx";
import PublicSite from "./pages/PublicSite.jsx";

export default function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/site" element={<PublicSite />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
