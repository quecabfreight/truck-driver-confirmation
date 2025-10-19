import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Hello from "./pages/Hello.jsx";
import Verify from "./pages/Verify.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Navigate to="/hello" replace />} />
          <Route path="/hello" element={<Hello />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/join" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

