import React from "react";

const STORAGE_KEY = "quecab-theme"; // "light" | "dark"

function applyTheme(theme) {
  const root = document.documentElement; // <html>
  if (!root) return;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // Fallback to OS preference
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState(getInitialTheme);

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const switchTo = theme === "dark" ? "light" : "dark";
  const label = theme === "dark" ? "Light Background" : "Dark Background";

  // High-contrast pill that reads well on both themes
  const pill = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.02em",
    borderRadius: 999,
    cursor: "pointer",
    userSelect: "none",
    // dynamic contrast
    color: theme === "dark" ? "#e8ecf2" : "#0b0e11",
    background:
      theme === "dark"
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.06)",
    border:
      theme === "dark"
        ? "1px solid rgba(255,255,255,0.18)"
        : "1px solid rgba(0,0,0,0.18)",
    boxShadow:
      theme === "dark"
        ? "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
        : "0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)",
    transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
  };

  const dot = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: theme === "dark" ? "#cfe1ff" : "#111827",
    boxShadow:
      theme === "dark"
        ? "0 0 8px rgba(160,200,255,0.8)"
        : "0 0 4px rgba(0,0,0,0.25)",
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setTheme(switchTo)}
      style={pill}
    >
      <span style={dot} />
      {label}
    </button>
  );
}
