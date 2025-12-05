import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          padding: "40px",
          fontSize: "24px",
        }}
      >
        <h1>Router Test OK</h1>
        <p>This confirms that React Router is working.</p>

        <nav style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <Link to="/" style={{ color: "cyan" }}>Home</Link>
          <Link to="/login" style={{ color: "cyan" }}>Login</Link>
          <Link to="/join" style={{ color: "cyan" }}>Join</Link>
        </nav>

        <Routes>
          <Route path="/" element={<div>HOME ROUTE OK</div>} />
          <Route path="/login" element={<div>LOGIN ROUTE OK</div>} />
          <Route path="/join" element={<div>JOIN ROUTE OK</div>} />
          <Route path="*" element={<div>UNKNOWN ROUTE</div>} />
        </Routes>
      </div>
    </Router>
  );
}
