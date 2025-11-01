import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES (unchanged)
import Login from "./pages/Login";
import Join from "./pages/Join";
import Home from "./pages/Home";

// Floating theme control – new
import GlobalThemeDock from "./components/GlobalThemeDock";

function App() {
  return (
    // Keep the same app shell & styling you already have
    <div className="app-shell min-h-screen w-full bg-black text-white">
      {/* One toggle that controls the WHOLE app */}
      <GlobalThemeDock />

      <Router>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Home />} />

          {/* Broker/Shipper login */}
          <Route path="/login" element={<Login />} />

          {/* Request authorization / join */}
          <Route path="/join" element={<Join />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
