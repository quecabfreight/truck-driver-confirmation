import { useState } from 'react'

export default function VerifyDriver() {
  const [pinEntered, setPinEntered] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [inputPIN, setInputPIN] = useState('')
  const [form, setForm] = useState({ usdot: '', phone: '', match: '', answered: '' })

  const DOCK_PIN = '2580' // temporary static pin (we’ll make this dynamic later)

  const handlePIN = (e) => {
    e.preventDefault()
    if (inputPIN === DOCK_PIN) {
      setPinEntered(true)
    } else {
      const next = attempts + 1
      setAttempts(next)
      if (next >= 3) alert('Unauthorized Dock Access. This attempt has been logged.')
      else alert(`Incorrect PIN (${next}/3)`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { match, answered } = form
    if (match === 'Y' && answered === 'Y') {
      alert('✅ CLEAR TO LOAD')
    } else {
      alert('🚨 CAUTION ALERT – DO NOT LOAD')
    }
  }

  if (!pinEntered && attempts < 3) {
    return (
      <div className="page verify-page">
        <div className="verify-card glass">
          <h2>Dock Access</h2>
          <p style={{ marginBottom: 16 }}>Enter 4-digit Dock PIN to continue:</p>
          <form onSubmit={handlePIN}>
            <input
              type="password"
              maxLength="4"
              value={inputPIN}
              onChange={(e) => setInputPIN(e.target.value)}
              className="input"
              placeholder="****"
              style={{ textAlign: 'center', letterSpacing: 6 }}
            />
            <button type="submit" className="btn" style={{ marginTop: 14 }}>
              Submit
            </button>
          </form>
          <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
            Attempts: {attempts}/3
          </p>
        </div>
      </div>
    )
  }

  if (attempts >= 3) {
    return (
      <div className="page verify-page">
        <div className="verify-card glass">
          <h2 style={{ color: '#f66' }}>ACCESS DENIED</h2>
          <p>This dock terminal has been temporarily locked.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page verify-page">
      <img
        src="/qc-logo.png"
        alt="QueCab AdbS"
        style={{ width: 180, display: 'block', margin: '0 auto 12px auto' }}
      />

      <div className="verify-card glass">
        <h2>Truck-Driver Verification</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label>USDOT #</label>
              <input
                className="input"
                placeholder="e.g. 1234567"
                value={form.usdot}
                onChange={(e) => setForm({ ...form, usdot: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Driver Phone</label>
              <input
                className="input"
                placeholder="123-456-7890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Does the USDOT# on the truck match?</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  className={`btn ${form.match === 'Y' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, match: 'Y' })}
                >
                  Y
                </button>
                <button
                  type="button"
                  className={`btn ${form.match === 'N' ? 'active red' : ''}`}
                  onClick={() => setForm({ ...form, match: 'N' })}
                >
                  N
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label>Did the driver answer their phone?</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  className={`btn ${form.answered === 'Y' ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, answered: 'Y' })}
                >
                  Y
                </button>
                <button
                  type="button"
                  className={`btn ${form.answered === 'N' ? 'active red' : ''}`}
                  onClick={() => setForm({ ...form, answered: 'N' })}
                >
                  N
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn big" style={{ marginTop: 18 }}>
            Submit Verification
          </button>
        </form>
      </div>
    </div>
  )
}
