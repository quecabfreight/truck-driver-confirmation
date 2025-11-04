import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Join from './pages/Join.jsx'
import DriverPing from './pages/DriverPing.jsx'
import VerifyDriver from './pages/VerifyDriver.jsx'
import './styles.css'
import { applyInitialTheme } from './utils/theme.js'

// set theme before anything renders
applyInitialTheme()

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          {/* Smart Link routes */}
          <Route path="/s/:token" element={<DriverPing />} />
          <Route path="/verify/:token" element={<VerifyDriver />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
