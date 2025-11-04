import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import BrandHero from '../components/BrandHero.jsx'

function YnButton({ value, onChange, label }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ fontWeight: 900 }}>{label}</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={() => onChange('Y')}
          className="btn"
          style={{ borderColor: value === 'Y' ? 'limegreen' : 'var(--edge)' }}
        >
          Y
        </button>
        <button
          type="button"
          onClick={() => onChange('N')}
          className="btn"
          style={{ borderColor: value === 'N' ? '#c91c1c' : 'var(--edge)' }}
        >
          N
        </button>
      </div>
    </div>
  )
}

export default function VerifyDriver() {
  const { token } = useParams()

  // Inputs
  const [usdot, setUsdot] = useState('')
  const [phone, setPhone] = useState('')
  const [match, setMatch] = useState('')
  const [answered, setAnswered] = useState('')

  // Result + attempts (per-token, silent)
  const [result, setResult] = useState(null) // 'CLEAR' | 'CAUTION' | null
  const [flash, setFlash] = useState(false)
  const attemptsKey = useMemo(() => `qca_attempts_${token || 'none'}`, [token])

  const alertAudio = useRef(null)
  useEffect(() => {
    alertAudio.current = new Audio('/alert.mp3') // if present
    alertAudio.current.volume = 0.7
  }, [])

  // basic format helpers
  function fmtPhone(v) {
    const s = v.replace(/[^\d]/g, '').slice(0, 10)
    if (s.length < 4) return s
    if (s.length < 7) return `${s.slice(0,3)}-${s.slice(3)}`
    return `${s.slice(0,3)}-${s.slice(3,6)}-${s.slice(6)}`
  }
  const usdotOk = /^\d{4,8}$/.test(usdot.replace(/[^\d]/g, ''))
  const phoneOk = /^\d{3}-\d{3}-\d{4}$/.test(phone)

  function evaluate() {
    if (!usdotOk || !phoneOk || !match || !answered) {
      setResult(null)
      return
    }
    const isClear = (match === 'Y' && answered === 'Y')
    setResult(isClear ? 'CLEAR' : 'CAUTION')

    if (!isClear) {
      // bump attempts silently
      const n = Number(localStorage.getItem(attemptsKey) || '0') + 1
      localStorage.setItem(attemptsKey, String(n))

      // red flash + sound (no UI about auto-alert)
      setFlash(true)
      setTimeout(() => setFlash(false), 420)
      try { alertAudio.current?.play() } catch {}
      if (n >= 3) {
        // Placeholder: would send alert to broker/shipper.
        // Intentionally not shown to dock personnel.
        console.log('[QueCab AdbS] Auto-alert would be sent to broker/shipper for token:', token)
      }
    }
  }

  useEffect(() => { evaluate() }, [usdot, phone, match, answered]) // live evaluation

  return (
    <>
      {/* local flash styles (self-contained, no global css change) */}
      <style>{`
        .qca-flash {
          animation: qcaFlash 420ms ease-in-out;
        }
        @keyframes qcaFlash {
          0% { box-shadow: 0 0 0 0 rgba(201,28,28,.0); }
          30% { box-shadow: 0 0 0 10px rgba(201,28,28,.25); }
          100% { box-shadow: 0 0 0 0 rgba(201,28,28,.0); }
        }
      `}</style>

      <BrandHero />
      <div className="centered">
        <section className={`card ${flash ? 'qca-flash' : ''}`} style={{ width: 'clamp(360px, 62vw, 1480px)' }}>
          <h2>Truck Driver Verification</h2>
          <form className="form form-wide" onSubmit={e => e.preventDefault()}>
            <label>
              <span>USDOT #</span>
              <input
                type="text"
                inputMode="numeric"
                value={usdot}
                onChange={e => setUsdot(e.target.value.replace(/[^\d]/g, '').slice(0, 8))}
                placeholder="e.g., 1234567"
              />
            </label>

            <label>
              <span>Driver Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(fmtPhone(e.target.value))}
                placeholder="123-456-7890"
              />
            </label>

            <YnButton value={match} onChange={setMatch} label="DOES THE USDOT# ON THE TRUCK MATCH?" />
            <YnButton value={answered} onChange={setAnswered} label="DID THE DRIVER ANSWER THEIR PHONE?" />

            {/* Result banner */}
            <div style={{ gridColumn: '1 / -1', marginTop: 6 }}>
              {result === 'CLEAR' && (
                <div style={{
                  border: '1px solid #194d19', background: 'linear-gradient(180deg, rgba(60,200,60,.15), rgba(60,200,60,.05))',
                  color: '#bdf7bd', padding: 18, borderRadius: 16, fontWeight: 900, textAlign: 'center'
                }}>
                  ✅ CLEAR TO LOAD
                </div>
              )}
              {result === 'CAUTION' && (
                <div style={{
                  border: '1px solid #7a1a1a', background: 'linear-gradient(180deg, rgba(201,28,28,.18), rgba(201,28,28,.06))',
                  color: '#ffdcdc', padding: 18, borderRadius: 16, fontWeight: 900, textAlign: 'center'
                }}>
                  ⚠️ CAUTION ALERT — DO NOT LOAD
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  )
}
