import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'

export default function Login() {
  const nav = useNavigate()
  const [businessEmail, setBusinessEmail] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [remember, setRemember] = useState(true)

  // Pre-fill if remembered
  useEffect(() => {
    const stored = localStorage.getItem('qc_login')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setBusinessEmail(parsed.businessEmail || '')
        setAccessCode(parsed.accessCode || '')
        setRemember(true)
      } catch { /* ignore */ }
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    // Minimal front-end checks only (Phase 1)
    if (!businessEmail || !accessCode) {
      alert('Enter Business Email and Access Code.')
      return
    }
    if (remember) {
      localStorage.setItem('qc_login', JSON.stringify({ businessEmail, accessCode }))
    } else {
      localStorage.removeItem('qc_login')
    }
    nav('/') // redirect to Home
  }

  return (
    <div className="centered">
      <Card>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            <span>Business Email</span>
            <input
              type="email"
              autoComplete="email"
              value={businessEmail}
              onChange={e => setBusinessEmail(e.target.value)}
            />
          </label>

          <label>
            <span>Access Code</span>
            <input
              type="password"
              autoComplete="current-password"
              value={accessCode}
              onChange={e => setAccessCode(e.target.value)}
            />
          </label>

          <label className="row">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            <span>Remember this device</span>
          </label>

          <button className="btn" type="submit">Continue</button>
        </form>
      </Card>
    </div>
  )
}
