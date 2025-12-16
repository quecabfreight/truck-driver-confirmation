import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function navClass({ isActive }) {
  return `qc-navlink ${isActive ? "qc-navlink-active" : ""}`;
}

export default function Layout({ children }) {
  const location = useLocation();

  // If you ever decide you want the header hidden on specific routes later,
  // we can add that here safely. For now: ALWAYS show header.
  const showHeader = true;

  return (
    <div className="qc-app">
      {showHeader && (
        <header className="qc-topbar">
          <div className="qc-topbar-inner">
            {/* BRAND / LOGO — ALWAYS GOES HOME */}
            <Link to="/" className="qc-brand" aria-label="QueCab AdbS Home">
              <img
                src="/qc-logo.png"
                alt="QueCab AdbS"
                className="qc-brand-logo"
              />
              <div className="qc-brand-text">
                <div className="qc-brand-title">QueCab AdbS</div>
                <div className="qc-brand-sub">Truck-Driver Confirmation</div>
              </div>
            </Link>

            {/* NAV */}
            <nav className="qc-nav" aria-label="Primary navigation">
              <NavLink to="/" className={navClass}>
                Home
              </NavLink>
              <NavLink to="/how-it-works" className={navClass}>
                How It Works
              </NavLink>
              <NavLink to="/login" className={navClass}>
                Log In
              </NavLink>
              <NavLink to="/join" className="qc-navbtn">
                Request Access
              </NavLink>
            </nav>
          </div>
        </header>
      )}

      <main className="qc-main" data-route={location.pathname}>
        {children}
      </main>

      <footer className="qc-footer">
        <div className="qc-footer-inner">
          <span>© {new Date().getFullYear()} QueCab Inc. — QueCab AdbS</span>
          <span className="qc-footer-sep">•</span>
          <a className="qc-footer-link" href="#/about">
            About
          </a>
          <span className="qc-footer-sep">•</span>
          <a className="qc-footer-link" href="#/contact">
            Contact
          </a>
        </div>
      </footer>

      {/* Minimal built-in styling so the layout never goes “unstyled white page” */}
      <style>{`
        .qc-app{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          background: radial-gradient(1200px 600px at 50% 15%, rgba(70,95,170,.35), rgba(10,14,22,1));
          color:#e9eefc;
        }
        .qc-topbar{
          position:sticky;
          top:0;
          z-index:50;
          backdrop-filter: blur(10px);
          background: rgba(8,10,16,.78);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .qc-topbar-inner{
          max-width:1100px;
          margin:0 auto;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:14px 18px;
          gap:16px;
        }
        .qc-brand{
          display:flex;
          align-items:center;
          gap:10px;
          text-decoration:none;
          color:inherit;
        }
        .qc-brand-logo{
          width:46px;
          height:46px;
          object-fit:contain;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,.55));
        }
        .qc-brand-title{
          font-weight:800;
          letter-spacing:.2px;
          line-height:1.05;
        }
        .qc-brand-sub{
          font-size:12px;
          opacity:.8;
          margin-top:2px;
        }
        .qc-nav{
          display:flex;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
          justify-content:flex-end;
        }
        .qc-navlink{
          color:#d8e3ff;
          text-decoration:none;
          font-weight:700;
          padding:10px 10px;
          border-radius:10px;
          opacity:.9;
        }
        .qc-navlink:hover{
          opacity:1;
          background: rgba(255,255,255,.06);
        }
        .qc-navlink-active{
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
        }
        .qc-navbtn{
          text-decoration:none;
          font-weight:800;
          padding:10px 14px;
          border-radius:12px;
          color:#ffffff;
          border: 1px solid rgba(255,255,255,.14);
          background: linear-gradient(180deg, rgba(80,125,255,.45), rgba(18,28,56,.75));
          box-shadow: 0 14px 30px rgba(0,0,0,.35);
          white-space:nowrap;
        }
        .qc-navbtn:hover{
          filter: brightness(1.05);
        }
        .qc-main{
          flex:1;
          width:100%;
        }
        .qc-footer{
          border-top: 1px solid rgba(255,255,255,.06);
          background: rgba(8,10,16,.68);
        }
        .qc-footer-inner{
          max-width:1100px;
          margin:0 auto;
          padding:14px 18px;
          font-size:12px;
          opacity:.85;
          display:flex;
          gap:10px;
          flex-wrap:wrap;
          align-items:center;
        }
        .qc-footer-link{
          color:#cfe0ff;
          text-decoration:none;
          font-weight:700;
        }
        .qc-footer-link:hover{
          text-decoration:underline;
        }
        .qc-footer-sep{ opacity:.55; }

        @media (max-width: 720px){
          .qc-topbar-inner{ align-items:flex-start; }
          .qc-nav{ width:100%; justify-content:flex-start; }
          .qc-brand-title{ font-size:16px; }
        }
      `}</style>
    </div>
  );
}
