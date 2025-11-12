// /src/App.jsx
import React from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Site from "./pages/Site.jsx";

// ---- STUB PAGES (leave your real ones as-is) ----
// If you already have these components, keep yours.
// These placeholders prevent crashes if a file is missing.
const Home = () => (
  <div style={{color:"#fff", textAlign:"center", padding:"40px"}}>
    <h1>QueCab AdbS — Truck-Driver Confirmation</h1>
    <p>Home placeholder (unchanged). Use the nav to open the new Website page.</p>
    <Link style={{color:"#1fe28c"}} to="/site">Open Website</Link>
  </div>
);
const Login = () => <div style={{color:"#fff",padding:40}}>Login placeholder</div>;
const Join  = () => <div style={{color:"#fff",padding:40}}>Request Access placeholder</div>;
const CheckIn = () => <div style={{color:"#fff",padding:40}}>Check-In placeholder</div>;
const About = () => <div style={{color:"#fff",padding:40}}>About placeholder</div>;

// ---------------- APP ----------------
export default function App(){
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/join"  element={<Join/>} />
        <Route path="/checkin" element={<CheckIn/>} />
        <Route path="/about" element={<About/>} />

        {/* NEW glossy website page */}
        <Route path="/site" element={<Site/>} />
      </Routes>
    </HashRouter>
  );
}
