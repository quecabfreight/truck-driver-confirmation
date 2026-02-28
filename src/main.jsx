// /src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { installGlobalCrashOverlay } from "./components/FatalErrorOverlay.jsx";

installGlobalCrashOverlay();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
