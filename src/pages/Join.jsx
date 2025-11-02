import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'

const mcRegex = /^MC\s*\d+$/i
const phoneRegex = /^[0-9()\-\s.+]{7,20}$/
const einRegex = /^\d{2}-?\d{7}$/ // optional

export default function Join() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    legalName: '',
    contactName: '',
    role: 'Broker',
    mc: '',
    ein: '',
    phone: '',
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.legalName.trim()) return alert('Enter Legal Name.')
    if (!form.contactName.trim()) return alert('Enter Contact Name.')
    if (!form.role) return alert('Select Role.')
    if (!mcRegex.test(form.mc.trim())) return alert('MC must be "MC" followed by digits only (e.g., MC123456).')
    if (form.ein && !einRegex.test(form.ein.trim())) return alert('EIN format should be 12-3456789 (digits only).')
    if (!phoneRegex.test(form.phone.trim())) return alert('Enter a valid Business Phone.')

    // Phase 1: local echo only (Phase 2 will email/DB)
    localStorage.setItem('qc_join_draft', JSON.stringify(form))
    alert('Request received (Phase 1). In Phase 2 this will submit to email/DB.')
    nav('/')
  }

  return (
    <div className="centered">
      <Card>
        <h2>Request Access</h2>

        {/* Wide desktop grid */}
        <form onSubmit={handleSubmit} className="form form-wide">
          <label>
            <span>Legal Name</span>
            <input
              type="text"
              value={form.legalName}
              onChange={e => update('legalName', e.target.value)}
            />
          </label>

          <label>
            <span>Contact Name</span>
            <input
              type="text"
              value={form.contactName}
              onChange={e => update('contactName', e.target.value)}
            />
          </label>

          <label>
            <span>Role</span>
            <select value={form.role} onChange={e => update('role', e.target.value)}>
              <option>Broker</option>
              <option>Shipper</option>
            </select>
          </label>

          <label>
            <span>MC (tag + digits)</span>
            <input
              type="text"
              value={form.mc}
              onChange={e => update('mc', e.target.value.toUpperCase())}
              placeholder="MC123456"
            />
          </label>

          <label>
            <span>EIN (optional)</span>
            <input
              type="text"
              value={form.ein}
              onChange={e => update('ein', e.target.value)}
              placeholder="12-3456789"
            />
          </label>

          <label>
            <span>Business Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
            />
          </label>

          <button className="btn" type="submit">Submit Request</button>
        </form>
      </Card>
    </div>
  )
}
