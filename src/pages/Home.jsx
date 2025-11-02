import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'

export default function Home() {
  return (
    <div className="stack">
      {/* Row 1 — Request Access */}
      <Card>
        <h2>Request Access</h2>
        <p>Broker or shipper? Get authorized to use QueCab AdbS.</p>
        <Link className="btn" to="/join">Go to /join</Link>
      </Card>

      {/* Row 2 — Already Authorized? Log In */}
      <Card>
        <h2>Already Authorized? Log In</h2>
        <p>Use your business email and access code to continue.</p>
        <Link className="btn" to="/login">Go to /login</Link>
      </Card>

      {/* Row 3 — About + footer lives below in layout */}
      <Card>
        <h2>About</h2>
        <p>
          QueCab AdbS helps brokers and shippers verify carriers quickly and confidently —
          realistic UI, no fluff, built for busy docks and office workflows. Phase 2 will add
          the dock check-in flow and verification display (USDOT# match + driver answered call Y/N).
        </p>
      </Card>
    </div>
  )
}
