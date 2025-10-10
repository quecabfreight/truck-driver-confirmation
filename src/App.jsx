import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import "./index.css";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import TruckDriverConfirmation from "./pages/TruckDriverConfirmation.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header" style={{ borderBottom: "1px solid #eee", padding: "12px 16px" }}>
        <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* brand text WITHOUT the word "App" */}
          <Link to="/" className="brand" style={{ fontWeight: 700, textDecoration: "none", color: "#222" }}>
            QueCab AdBS
          </Link>
          <div style={{ flex: 1 }} />
          <Link to="/verify" style={{ textDecoration: "none" }}>Verify Driver</Link>
        </nav>
      </header>

      <main className="page" style={{ padding: "16px" }}>
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/verify" element={<VerifyDriver />} />
          <Route path="/confirm" element={<TruckDriverConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
