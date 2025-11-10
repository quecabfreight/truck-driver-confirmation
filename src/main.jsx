// /src/main.jsx — FULL OVERWRITE
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ⬇️ FORCE import of the new global stylesheet (cache-busted filename)
import "./qc-global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
