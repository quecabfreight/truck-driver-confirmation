import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="qc-app">
      {/* HEADER */}
      <header className="qc-header">
        <div className="qc-header-inner">
          {/* LOGO → HOME */}
          <Link to="/" className="qc-logo-link" aria-label="Go to homepage">
            <img
              src="/qc-logo.png"
              alt="QueCab AdbS"
              className="qc-logo"
            />
          </Link>

          {/* NAV */}
          <nav className="qc-nav">
            <Link to="/" className="qc-nav-link">
              Home
            </Link>
            <Link to="/how-it-works" className="qc-nav-link">
              How It Works
            </Link>
            <Link to="/login" className="qc-nav-link">
              Log In
            </Link>
          </nav>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="qc-main">{children}</main>
    </div>
  );
}
