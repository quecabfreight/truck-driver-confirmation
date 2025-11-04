import BrandHero from '../components/BrandHero.jsx'
import { useParams } from 'react-router-dom'

export default function DriverPing() {
  const { token } = useParams()

  return (
    <>
      <BrandHero />
      <div className="centered">
        <section className="card" style={{ textAlign: 'center' }}>
          <h2>You're checking in…</h2>
          <p style={{ marginTop: 8 }}>
            Thanks for tapping the link. Please proceed to the dock window.
          </p>
          <p style={{ color: 'var(--muted)', marginTop: 18, fontWeight: 900 }}>
            (Ref: {String(token || '').slice(0, 6)}…)
          </p>
        </section>
      </div>
    </>
  )
}
