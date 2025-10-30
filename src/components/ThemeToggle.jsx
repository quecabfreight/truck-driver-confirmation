import React, { useEffect, useState } from "react";

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("qc-theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        fontSize: compact ? 11 : 12,
        borderRadius: 8,
        padding: compact ? "6px 10px" : "8px 12px",
        background: "var(--plate)",
        color: "var(--text)",
        border: "1px solid var(--border)",
        cursor: "pointer",
      }}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? "Light Background" : "Dark Background"}
    </button>
  );
}
