import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";

function App() {
  return (
    <div className="app-shell min-h-screen w-full bg-black text-white">
      {/* App-wide background + routing */}
      <Router>
        <Routes>
          {/* Dashboard / landing */}
          <Route path="/" element={<Home />} />

          {/* Broker/Shipper login */}
          <Route path="/login" element={<Login />} />

          {/* Request access / authorization form */}
          <Route path="/join" element={<Join />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
