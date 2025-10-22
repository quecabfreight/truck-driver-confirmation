import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "/src/components/ErrorBoundary.jsx";
import Hello from "/src/pages/Hello.jsx";
import Verify from "/src/pages/Verify.jsx";
import Login from "/src/pages/Login.jsx";
import Register from "/src/pages/Register.jsx";

function App() {
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

export default App;   // <-- default export (required by Vite entry)
export { App };      // <-- named export too (extra-safe)
