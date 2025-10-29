import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORT YOUR PAGES
import Login from "./pages/Login";
import Join from "./pages/Join";
import Home from "./pages/Home";

function App() {
  return (
    <div className="app-shell min-h-screen w-full bg-black text-white">
      {/* 
        Global app shell.
        Keep your dark / industrial background styling here 
        (loading dock vibe, subtle texture, etc.).
        We are not changing branding, colors, or layout tone.
      */}
      <Router>
        <Routes>
          {/* Landing after auth / dashboard placeholder */}
          <Route path="/" element={<Home />} />

          {/* Broker/Shipper login */}
          <Route path="/login" element={<Login />} />

          {/* Request authorization / join flow */}
          <Route path="/join" element={<Join />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
