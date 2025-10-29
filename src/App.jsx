import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// IMPORT YOUR PAGES
import Login from "./pages/Login";
// If you already have Join / Authorization Request form screen:
import Join from "./pages/Join"; 
// If you have a dashboard/home landing after login:
import Home from "./pages/Home"; 
// ^ If you don't have Home yet, make a placeholder to avoid crash.

function App() {
  return (
    // Global app shell.
    // This wrapper is where you keep the same dark professional background
    // (industrial dock / warehouse vibe, subtle texture, etc.)
    <div className="app-shell min-h-screen w-full bg-black text-white">
      <Router>
        <Routes>
          {/* Landing after auth */}
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
