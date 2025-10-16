import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Use self-closing with children to avoid any tag-mismatch weirdness */}
    <BrowserRouter basename="/" children={<App />} />
  </React.StrictMode>
);

