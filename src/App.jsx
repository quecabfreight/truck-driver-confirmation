import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Verify from "./pages/Verify.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

