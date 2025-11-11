// /src/App.jsx — website at "/", app pages unchanged
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";

import Website from "./pages/Website.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import CheckIn from "./pages/CheckIn.jsx";

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell" style={{ minHeight:"100dvh", display:"flex", flexDirection:"column" }}>
        <Header />
        <main style={{ flex:1 }}>
          <Routes>
            <Route path="/" element={<Website />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/checkin" element={<CheckIn />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
