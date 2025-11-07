import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (remember) localStorage.setItem("qc_remember", "1");
    nav("/login#/panel"); // placeholder flow per Phase 1
  };

  return (
    <div className="container">
      {/* Big metallic logo (top-center) */}
      <img
        src="/qc-logo.png"
        alt="QueCab AdbS"
        className="centered-logo"
        style={{ maxWidth: 360, height: "auto", display: "block", margin: "0 auto 18px" }}
      />

      <div className="card" style={{ maxWidth: 760 }}>
        {/* TITLE: same size as Home (≈32pt desktop) */}
        <h2 style={{ margin: 0, marginBottom: 10, fontWeight: 800, fontSize: "clamp(
