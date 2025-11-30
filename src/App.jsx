import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* HOW IT WORKS */}
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* REQUEST ACCESS */}
        <Route path="/join" element={<Join />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* CONTROL CENTER */}
        <Route path="/control-center" element={<ControlCenter />} />

        {/* TRUCK-DRIVER VERIFICATION */}
        <Route path="/verify/:token" element={<VerifyDriver />} />

        {/* FALLBACK */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
