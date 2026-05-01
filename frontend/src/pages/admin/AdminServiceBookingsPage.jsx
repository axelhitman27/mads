import { useEffect, useState } from 'react'
import { adminGetServiceBookings, adminUpdateServiceBookingStatus } from '../../lib/api'

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled']

function AdminServiceBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await adminGetServiceBookings()
      setBookings(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(loadError.message || 'Failed to load service bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (booking, status) => {
    try {
      setError('')
      setFeedback('')
      await adminUpdateServiceBookingStatus(
        booking.id,
        status,
        booking.adminNotes || '',
      )
      setFeedback('Service booking status updated.')
      await load()
    } catch (updateError) {
      setError(updateError.message || 'Failed to update service booking status.')
    }
  }

  const handleNotesChange = async (booking, adminNotes) => {
    try {
      setError('')
      setFeedback('')
      await adminUpdateServiceBookingStatus(
        booking.id,
        booking.status,
        adminNotes,
      )
      setFeedback('Service booking notes updated.')
      await load()
    } catch (updateError) {
      setError(updateError.message || 'Failed to update admin notes.')
    }
  }

  return (
    <section className="section">
      <div>
        <h2>Admin - Service Bookings</h2>
        <p className="section-muted">
          Manage incoming scooter service requests and status workflow.
        </p>
      </div>

      <div className="actions" style={{ marginBottom: '0.75rem' }}>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {loading ? <p className="status">Loading service bookings...</p> : null}
      {error ? <p className="status error">{error}</p> : null}
      {feedback ? <p className="status success">{feedback}</p> : null}

      {!loading ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Scooter</th>
                <th>Issue</th>
                <th>Preferred date</th>
                <th>Status</th>
                <th>Admin notes</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.customerFullName}</strong>
                    <div className="status">{booking.email}</div>
                    <div className="status">{booking.customerPhone}</div>
                  </td>
                  <td>{booking.serviceName}</td>
                  <td>
                    {booking.scooterBrand} {booking.scooterModel}
                  </td>
                  <td>{booking.issueDescription}</td>
                  <td>{booking.preferredDateNote}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        handleStatusChange(booking, event.target.value)
                      }
                    >
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ minWidth: '200px' }}>
                    <textarea
                      rows={3}
                      defaultValue={booking.adminNotes ?? ''}
                      onBlur={(event) =>
                        handleNotesChange(booking, event.target.value)
                      }
                      style={{
                        width: '100%',
                        border: '1px solid var(--surface-border)',
                        borderRadius: '0.5rem',
                        background: 'var(--surface-2)',
                        color: 'var(--text-main)',
                      }}
                    />
                  </td>
                  <td>{new Date(booking.createdAtUtc).toLocaleString('el-GR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default AdminServiceBookingsPage
