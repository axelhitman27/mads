import { useEffect, useState } from 'react'
import { createServiceBooking, getShopServices } from '../lib/api'
import { formatCurrency } from '../lib/format'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  serviceOfferingId: '',
  scooterBrand: '',
  scooterModel: '',
  issueDescription: '',
  preferredDateNote: '',
}

function ServicesPage() {
  const [services, setServices] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const abortController = new AbortController()

    const load = async () => {
      try {
        const result = await getShopServices({ signal: abortController.signal })
        if (active) {
          setServices(result)
        }
      } catch {
        if (active) {
          setServices([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      active = false
      abortController.abort()
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')
    setError('')

    try {
      await createServiceBooking({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        serviceOfferingId: formData.serviceOfferingId ? Number(formData.serviceOfferingId) : null,
        scooterBrand: formData.scooterBrand,
        scooterModel: formData.scooterModel,
        issueDescription: formData.issueDescription,
        preferredDateNote: formData.preferredDateNote,
      })
      setFeedback('Service request submitted successfully.')
      setFormData(initialForm)
    } catch (submitError) {
      setError(submitError.message || 'Service booking failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="stack">
      <section className="hero">
        <p className="eyebrow">Service Center</p>
        <h1>Service for e-scooters and electric mobility</h1>
        <p className="lead">
          Book diagnostics, maintenance, and repairs directly from the e-shop.
        </p>
      </section>

      <section className="section">
        <h2>Available Services</h2>
        {loading ? <p className="status">Loading services...</p> : null}
        <div className="grid grid-services">
          {services.map((service) => (
            <article key={service.id} className="card">
              <div className="card-content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="product-price-row">
                  <span className="price">From {formatCurrency(service.priceFrom, service.currency)}</span>
                  <span>{service.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section panel">
        <h2>Book a Service Appointment</h2>
        <form className="field-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="serviceOfferingId">Service Type</label>
            <select
              id="serviceOfferingId"
              name="serviceOfferingId"
              value={formData.serviceOfferingId}
              onChange={handleChange}
            >
              <option value="">Select service (optional)</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="scooterBrand">Scooter Brand</label>
            <input
              id="scooterBrand"
              name="scooterBrand"
              value={formData.scooterBrand}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="scooterModel">Scooter Model</label>
            <input
              id="scooterModel"
              name="scooterModel"
              value={formData.scooterModel}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="issueDescription">Issue Description</label>
            <textarea
              id="issueDescription"
              name="issueDescription"
              rows={5}
              value={formData.issueDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="preferredDateNote">Preferred Date/Time Note</label>
            <input
              id="preferredDateNote"
              name="preferredDateNote"
              value={formData.preferredDateNote}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit service request'}
          </button>
          {feedback ? <p className="status success">{feedback}</p> : null}
          {error ? <p className="status error">{error}</p> : null}
        </form>
      </section>
    </div>
  )
}

export default ServicesPage
