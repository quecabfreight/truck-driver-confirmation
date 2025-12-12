import { NavLink } from "react-router-dom";

export default function Layout({ pageTitle, children }) {
  // Optional: update document title
  if (pageTitle && typeof document !== "undefined") {
    document.title = `QueCab AdbS — ${pageTitle}`;
  }

  const shellStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #111827 0, #020617 40%, #000000 100%)",
    color: "#f9fafb",
  };

  // SINGLE header band – this is the ONLY bar that should exist
  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.97))",
    borderBottom: "1px solid rgba(15,23,42,0.9)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.75)",
  };

  const headerInnerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  };

  const brandRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const logoStyle = {
    height: "40px",
    width: "40px",
    objectFit: "contain",
  };

  const brandTextStyle = {
    fontSize: "1.15rem",
    fontWeight: 700,
    letterSpacing: "0.03em",
  };

  const navStyle = {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    fontSize: "0.9rem",
  };

  const linkBaseStyle = {
    textDecoration: "none",
    color: "#e5e7eb",
    paddingBottom: "2px",
  };

  const activeUnderlineStyle = {
    borderBottom: "2px solid #22c55e",
    color: "#ffffff",
  };

  return (
    <div style={shellStyle}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={brandRowStyle}>
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS logo"
              style={logoStyle}
            />
            <span style={brandTextStyle}>QueCab AdbS</span>
          </div>
          <nav style={navStyle}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? activeUnderlineStyle : {}),
              })}
            >
              Home
            </NavLink>
            <NavLink
              to="/how-it-works"
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? activeUnderlineStyle : {}),
              })}
            >
              How It Works
            </NavLink>
            <NavLink
              to="/login"
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? activeUnderlineStyle : {}),
              })}
            >
              Log In
            </NavLink>
            <NavLink
              to="/join"
              style={({ isActive }) => ({
                ...linkBaseStyle,
                ...(isActive ? activeUnderlineStyle : {}),
              })}
            >
              Request Access
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Page content */}
      {children}
    </div>
  );
}
