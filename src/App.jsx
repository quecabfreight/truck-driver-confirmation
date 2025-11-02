import { Outlet, Link, useLocation } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          {/* Logo only (title/subtitle removed per your note) */}
          <img src="/qc-logo.png" alt="QueCab AdbS" className="brand-logo" />
        </div>

        <div className="header-actions">
          <nav className="top-nav">
            <Link className={`nav-link${pathname === '/' ? ' active' : ''}`} to="/">Home</Link>
            <Link className={`nav-link${pathname === '/login' ? ' active' : ''}`} to="/login">Log In</Link>
            <Link className={`nav-link${pathname === '/join' ? ' active' : ''}`} to="/join">Request Access</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} QueCab AdbS — Professional tools for brokers & shippers.</p>
      </footer>
    </div>
  )
}
