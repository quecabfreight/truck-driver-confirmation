import React from "react";
import ThemeToggle from "./ThemeToggle";

/**
 * Floating theme toggle shown on every route.
 * Small, discreet, top-left; no layout shifts anywhere.
 */
export default function GlobalThemeDock() {
  const dock = {
    position: "fixed",
    top: 10,
    left: 10,
    zIndex: 9999,
    backdropFilter: "blur(2px)",
  };
  return (
    <div style={dock} aria-label="Theme control">
      <ThemeToggle />
    </div>
  );
}
