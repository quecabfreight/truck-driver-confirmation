import React from "react";
import { BUILD_ID } from "../config/build";

export default function Footer() {
  return (
    <footer
      className="footer"
      style={{
        marginTop: 40,
        padding: "24px 0",
        textAlign: "center",
        opacity: 0.9,
        fontSize: "1.25rem",
      }}
    >
      <div>© QueCab AdbS 2025 • <strong>BETA</strong> • Build <code>{BUILD_ID}</code></div>
    </footer>
  );
}
