import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* HOW IT WORKS 
              For now this uses Home.
              Later, if we split out a HowItWorks page, 
              we’ll update this route and add that file. */}
          <Route path="/how-it-works" element={<Home />} />

          {/* REQUEST ACCESS */}
          <Route path="/join" element={<Join />} />

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* AdbS CONTROL CENTER */}
          <Route path="/control-center" element={<ControlCenter />} />

          {/* TRUCK-DRIVER VERIFICATION */}
          <Route path="/verify/:token" element={<VerifyDriver />} />

          {/* FALLBACK */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}
