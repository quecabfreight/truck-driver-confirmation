import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Pages that use the standard site header/nav */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/control-center" element={<ControlCenter />} />
          <Route path="*" element={<Home />} />
        </Route>

        {/* Verify stays standalone if you want it later (optional) */}
        <Route path="/verify/:token" element={<VerifyDriver />} />
      </Routes>
    </HashRouter>
  );
}
