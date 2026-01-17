import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

// Keep your existing pages if they already exist.
// If you already have Join/About pages, keep their filenames the same and update imports here.
import Join from "./pages/Join.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}
