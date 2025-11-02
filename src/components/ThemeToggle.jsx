import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const t = window.__qcGetTheme ? window.__qcGetTheme() : "dark";
      setTheme(t);
    } catch {
      setTheme("dark");
    }
  }, []);

  function onToggle() {
    try {
      const next = window.__qcToggleTheme();
      setTheme(next);
    } catch {
      // no-op
    }
  }

  const label = theme === "dark" ? "Light Background" : "Dark Background";

  const wrap = {
    position: "fixed",
    top: 12,
    left: 12,
    zIndex: 9999,
  };
  const btn = {
    padding: "6px 12px",
    fontSize: 12,
    borderRadius: 999,
    border: `1px solid var(--border)`,
    background: "color-mix(in oklab, var(--card) 92%, white 8%)",
    color: "var(--text)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
    cursor: "pointer",
    userSelect: "none",
  };

  return (
    <div style={wrap}>
      <button type="button" onClick={onToggle} style={btn} aria-label="Toggle background">
        {label}
      </button>
    </div>
  );
}
