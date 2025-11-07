import React from "react";
import { Link } from "react-router-dom";

/**
 * Minimal, crash-proof header:
 * - No effects, no window access, no custom hooks.
 * - Simple Light/Dark toggle that only flips the "dark" class on <html>.
 */
export default function Header() {
  const isDark = document.documentElement.classList.contains("dark");
  const [dark, setDark] = React.useState(isDark);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("dark");  // light
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");     // dark
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  React.useEffect(() => {
    // Ensure a theme is set once, default dark
    const saved = localStorage.getItem("theme");
    const root = document.documentElement;
    if (saved === "light") root.classList.remove("dark");
    else root.classList.add("dark");
    setDark(root.classList.contains("dark"));
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Left side intentionally blank per your spec (no tiny logo here) */}
        <div />

        {/* Right side nav */}
        <nav style={{ display: "flex", gap: 10 }}>
          <Link className="btn" to="/">Home</Link>
          <Link className="btn" to="/login">Log In</Link>
          <Link className="btn" to="/join">Request Access</Link>
          <button className="btn" onClick={toggleTheme}>
            {dark ? "Light" : "Dark"}
          </button>
        </nav>
      </div>
    </header>
  );
}
