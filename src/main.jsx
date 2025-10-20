import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Load our styles once
import "./pages/verify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
