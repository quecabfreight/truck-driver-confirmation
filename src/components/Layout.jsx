import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", background: "#0b0f19" }}>
      {/* HEADER / NAV */}
      <header
        style={{
          width: "100%",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Link to="/">
          <img
            src="/qc-logo.png"
            alt="QueCab AdbS Logo"
            style={{ height: "70px", width: "auto" }}
          />
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "20px",
          }}
        >
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
