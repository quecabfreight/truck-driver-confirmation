import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0f19", color: "white" }}>
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "#0b0f19",
          position: "sticky",
          top: 0,
          zIndex: 999,
        }}
      >
        {/* LOGO (click → Home) */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{ height: "68px", width: "auto" }}
          />
        </Link>

        {/* PAGE LINKS */}
        <nav style={{ display: "flex", gap: "32px", fontSize: "20px" }}>
          <Link style={{ color: "white" }} to="/">Home</Link>
          <Link style={{ color: "white" }} to="/how-it-works">How It Works</Link>
          <Link style={{ color: "white" }} to="/login">Log In</Link>
          <Link style={{ color: "white" }} to="/join">Request Access</Link>
        </nav>
      </header>

      {/* PAGE CONTENT */}
      <main style={{ padding: "40px" }}>{children}</main>
    </div>
  );
}
