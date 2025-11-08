import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Join from "./pages/Join";
import VerifyDriver from "./pages/VerifyDriver";
import SmartLink from "./pages/SmartLink";
import DriverScreen from "./pages/DriverScreen";
import "./index.css";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Router>
      <div className="app-container">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/join" element={<Join />} />
            <Route path="/verify/:token" element={<VerifyDriver />} />
            <Route path="/smart" element={<SmartLink />} />
            <Route path="/s/:token" element={<DriverScreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
