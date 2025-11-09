import React from "react";
import { BUILD_ID, BUGS_EMAIL } from "../config/build";

export default function BugButton() {
  const click = () => {
    const url = window.location.href;
    const ua = navigator.userAgent || "";
    const when = new Date().toISOString();

    const subject = encodeURIComponent(`Bug – AdbS – ${BUILD_ID} – ${window.location.hash || window.location.pathname}`);
    const bodyLines = [
      "Describe what happened (short):",
      "",
      "",
      "Expected:",
      "",
      "",
      "Steps to reproduce:",
      "1.",
      "2.",
      "3.",
      "",
      `Page: ${url}`,
      `Build: ${BUILD_ID}`,
      `Device/Browser: ${ua}`,
      `Time (UTC): ${when}`,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    window.location.href = `mailto:${BUGS_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <button
      onClick={click}
      title="Report a bug"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        padding: "12px 14px",
        borderRadius: 14,
        fontWeight: 800,
        border: "2px solid var(--button-border, #222)",
        background: "var(--button-bg, #111)",
        color: "var(--button-text, #fff)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        cursor: "pointer",
      }}
    >
      🐞 Bug
    </button>
  );
}
