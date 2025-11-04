import { NavLink, Outlet } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  return (
    <div className="app-shell">
      {/* Top navigation */}
      <header
        className="topbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'saturate(120%) blur(6px)',
          background:
            'linear-gradient(180deg, rgba(0,0,0,.38), rgba(0,0,0,.22))',
          borderBottom: '1px solid rgba(255,255,255,.06)',
        }}
      >
        <div
          className="topbar__inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '10px 18px',
            maxWidth: 1280,
            margin: '0 auto',
          }}
        >
          {/* Left: primary nav */}
          <nav
            aria-label="Primary"
            style={{ display: 'flex', gap: 14, alignItems: 'center' }}
          >
            <NavItem to="/">Home</NavItem>
            <NavItem to="/login">Log In</NavItem>
            <NavItem to="/join">Request Access</NavItem>
          </nav>

          {/* Right: theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main content wrapper (used by watermark CSS: .app-main::before) */}
      <main className="app-main" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,.06)',
          padding: '18px 12px',
          fontSize: 12,
          color: 'var(--muted, #9aa4b2)',
          textAlign: 'center',
        }}
      >
        © 2025 QueCab AdbS — Professional tools for brokers &amp; shippers.
      </footer>
    </div>
  )
}

/** Small helper so active links look consistent */
function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
      style={({ isActive }) => ({
        padding: '8px 10px',
        borderRadius: 10,
        fontWeight: 900,
        textDecoration: 'none',
        color: 'inherit',
        border: isActive ? '1px solid rgba(255,255,255,.14)' : '1px solid rgba(255,255,255,.06)',
        background: isActive
          ? 'linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02))'
          : 'transparent',
        boxShadow: isActive ? '0 6px 18px rgba(0,0,0,.25)' : 'none',
      })}
    >
      {children}
    </NavLink>
  )
}
