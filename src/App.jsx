import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* REQUEST ACCESS */}
          <Route path="/join" element={<Join />} />

          {/* LOGIN (BUSINESS EMAIL + ACCESS CODE) */}
          <Route path="/login" element={<Login />} />

          {/* TRUCK-DRIVER VERIFY LINK */}
          <Route path="/verify/:token" element={<VerifyDriver />} />

          {/* CATCH-ALL → HOME */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}
