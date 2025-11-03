import { useState } from 'react'
import Card from '../components/Card.jsx'
import BrandHero from '../components/BrandHero.jsx'

export default function Login() {
  const [email, setEmail] = useState(localStorage.getItem('qc_email') || '')
  const [code, setCode] = useState('')
  const [remember, setRemember] = useState(localStorage.getItem('qc_remember') === '1')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSaved(false)

    if (!email.trim()) return alert('Enter your business email.')
    if (!code.trim()) return alert('Enter your access code.')

    if (remember) {
      localStorage.setItem('qc_email', email)
      localStorage.setItem('qc_remember', '1')
    } else {
      localStorage.removeItem('qc_email')
      localStorage.removeItem('qc_remember')
    }

    // Stay on this page (no redirect). Show subtle confirmation.
    setSaved(true)
  }

  return (
    <>
      <BrandHero compact />
      <div className="centered">
        <Card>
          <h2>Log In</h2>
          <form onSubmit={handleSubmit} className="form">
            <label>
              <span>Business Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label>
              <span>Access Code</span>
              <input type="password" value={code} onChange={e => setCode(e.target.value)} />
            </label>
            <label className="row">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span>Remember this device</span>
            </label>
            <button className="btn" type="submit">Continue</button>
            {saved && (
              <div style={{ marginTop: 12, color: 'var(--muted)', fontWeight: 900 }}>
                Saved on this device.
              </div>
            )}
          </form>
        </Card>
      </div>
    </>
  )
}
