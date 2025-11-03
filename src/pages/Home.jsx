import { Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import BrandHero from '../components/BrandHero.jsx'

export default function Home() {
  return (
    <>
      <BrandHero />
      <div className="stack">
        <Card>
          <h2>Request Access</h2>
          <p>Broker or shipper? Get authorized to use QueCab AdbS.</p>
          <Link to="/join" className="btn">Go to /join</Link>
        </Card>

        <Card>
          <h2>Already Authorized? Log In</h2>
          <p>Use your business email and access code to continue.</p>
          <Link to="/login" className="btn">Go to /login</Link>
        </Card>

        <Card>
          <h2>About</h2>
          <p>QueCab AdbS helps brokers and shippers verify carriers quickly and confidently.</p>
        </Card>
      </div>
    </>
  )
}
