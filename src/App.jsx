import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";

function About() {
  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <a href="/#/" style={styles.brandLink} aria-label="Go Home">
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS"
            style={styles.logo}
            draggable="false"
          />
        </a>

        <div style={styles.card}>
          <div style={styles.cardTitle}>About QueCab AdbS</div>
          <div style={styles.cardText}>
            QueCab AdbS is designed to help brokers and shippers verify the
            Truck-Driver (truck + driver as a pair) at the dock and reduce
            double-brokering risk through simple, fast confirmation steps.
          </div>

          <div style={styles.footer}>
            © {new Date().getFullYear()} QueCab AdbS
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 600px at 20% 10%, rgba(58, 110, 160, 0.20), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(30, 80, 140, 0.18), transparent 55%), #06090f",
    color: "#e9eef7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  shell: { width: "100%", maxWidth: 760 },
  brandLink: { display: "inline-flex", alignItems: "center", marginBottom: 14 },
  logo: { width: 220, height: "auto" },
  card: {
    background: "rgba(12, 18, 30, 0.82)",
    border: "1px solid rgba(110, 160, 210, 0.22)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  cardTitle: { fontSize: 22, fontWeight: 900, marginBottom: 10 },
  cardText: {
    fontSize: 15,
    lineHeight: 1.5,
    color: "rgba(233, 238, 247, 0.85)",
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    color: "rgba(233, 238, 247, 0.55)",
    textAlign: "center",
  },
};
