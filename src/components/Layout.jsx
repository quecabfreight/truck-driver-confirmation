import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  function goHome(e) {
    e.preventDefault();
    navigate("/");
    // fallback (HashRouter-safe)
    window.location.hash = "#/";
  }

  return (
    <div className="qc-shell">
      <header className="qc-topbar">
        <div className="qc-topbar-inner">
          <a
            href="#/"
            onClick={goHome}
            className="qc-brand"
            aria-label="QueCab AdbS Home"
            style={{ cursor: "pointer" }}
          >
            <img src="/qc-logo.png" alt="QueCab AdbS" className="qc-toplogo" />
            <div className="qc-brand-text">
              <div className="qc-brand-title">QueCab AdbS</div>
              <div className="qc-brand-sub">Truck-Driver Confirmation</div>
            </div>
          </a>

          <nav className="qc-nav">
            <NavLink to="/" className="qc-nav-link">
              Home
            </NavLink>
            <NavLink to="/how-it-works" className="qc-nav-link">
              How It Works
            </NavLink>
            <NavLink to="/login" className="qc-nav-link">
              Log In
            </NavLink>
            <NavLink to="/join" className="qc-nav-link qc-nav-cta">
              Request Access
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="qc-inner">
        <Outlet />
      </main>
    </div>
  );
}
