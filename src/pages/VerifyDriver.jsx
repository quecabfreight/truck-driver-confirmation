import { useEffect, useRef, useState } from 'react'

export default function VerifyDriver() {
  const [pinEntered, setPinEntered] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [inputPIN, setInputPIN] = useState('')
  const [form, setForm] = useState({ usdot: '', phone: '', match: '', answered: '' })
  const [flash, setFlash] = useState(false)
  const [result, setResult] = useState('')
  const alertAudio = useRef(null)

  const DOCK_PIN = '2580' // temporary static PIN

  useEffect(() => {
    alertAudio.current = new Audio('/alert.mp3') // must exist in /public
    alertAudio.current.volume = 0.75
  }, [])

  // Handle Dock PIN
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

  // Evaluate form result
  const handleSubmit = (e) => {
    e.preventDefault()
    const { match, answered } = form
    if (match === 'Y' && answered === 'Y') {
      setResult('clear')
    } else {
      setResult('caution')
      try { alertAudio.current?.play() } catch {}
      setFlash(true)
      setTimeout(() => setFlash(false), 400)
    }
  }

  // Simple phone formatter
  const formatPhone = (v) => {
    const s = v.replace(/[^\d]/g, '').slice(0, 10)
    if (s.length < 4) return s
    if (s.length < 7) return `${s.slice(0, 3)}-${s.slice(3)}`
    return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`
  }

  // ---- Screens ----
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

  // ---- Main Verification Form ----
  return (
    <div className={`page verify-page ${flash ? 'flash' : ''}`}>
      <style>{`
        @keyframes redFlash {
          0% { background: rgba(201,28,28,0.0); }
          25% { background: rgba(201,28,28,0.25); }
          50% { background: rgba(201,28,28,0.35); }
          100% { background: rgba(201,28,28,0.0); }
        }
        .flash {
          animation: redFlash 0.4s ease-in-out;
        }
      `}</style>

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
                onChange={(e) =>
                  setForm({ ...form, usdot: e.target.value.replace(/[^\d]/g, '').slice(0, 8) })
                }
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Driver Phone</label>
              <input
                className="input"
                placeholder="123-456-7890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
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

        {/* Results */}
        {result === 'clear' && (
          <div
            style={{
              marginTop: 18,
              padding: '16px 10px',
              borderRadius: 14,
              textAlign: 'center',
              fontWeight: 900,
              background: 'rgba(0,255,0,0.08)',
              border: '1px solid rgba(0,255,0,0.25)',
              color: '#bdf7bd',
            }}
          >
            ✅ CLEAR TO LOAD
          </div>
        )}

        {result === 'caution' && (
          <div
            style={{
              marginTop: 18,
              padding: '16px 10px',
              borderRadius: 14,
              textAlign: 'center',
              fontWeight: 900,
              background: 'rgba(201,28,28,0.1)',
              border: '1px solid rgba(201,28,28,0.35)',
              color: '#ffdcdc',
            }}
          >
            ⚠️ CAUTION ALERT — DO NOT LOAD
          </div>
        )}
      </div>
    </div>
  )
}
