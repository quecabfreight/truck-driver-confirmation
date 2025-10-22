import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Load styles once (safe)
import "./pages/verify.css";

const el = document.getElementById("root");
if (!el) {
  const warn = document.createElement("div");
  warn.textContent = "Mount point #root not found.";
  warn.style.cssText = "padding:16px;font-family:system-ui;color:#fff;background:#111";
  document.body.appendChild(warn);
} else {
  el.textContent = "Mounting…";
  try {
    ReactDOM.createRoot(el).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("QueCab AdbS mounted");
  } catch (err) {
    console.error("Mount error:", err);
    el.innerHTML = `
      <div style="padding:20px;color:#fff;background:#111;font-family:system-ui">
        <h1 style="margin:0 0 8px">QueCab AdbS — Mount Error</h1>
        <pre style="white-space:pre-wrap;background:#181818;padding:12px;border-radius:8px">${String(err)}</pre>
        <div><a href="/hello" style="color:#9cf">Try /hello</a></div>
      </div>
    `;
  }
}
