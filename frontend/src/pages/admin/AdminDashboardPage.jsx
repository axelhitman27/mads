import { useEffect, useState } from 'react'
import { adminGetOrders, adminGetServiceBookings, adminGetProducts } from '../../lib/api'

function AdminDashboardPage() {
  const [summary, setSummary] = useState({ products: 0, orders: 0, bookings: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const abortController = new AbortController()

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [products, orders, bookings] = await Promise.all([
          adminGetProducts({ signal: abortController.signal }),
          adminGetOrders({ signal: abortController.signal }),
          adminGetServiceBookings({ signal: abortController.signal }),
        ])

        if (!active) {
          return
        }

        setSummary({
          products: products.length,
          orders: orders.length,
          bookings: bookings.length,
        })
      } catch (loadError) {
        if (!active || loadError.name === 'AbortError') {
          return
        }
        setError(loadError.message || 'Unable to load admin summary.')
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

  return (
    <section className="section">
      <h1>Admin Dashboard</h1>
      <p className="section-muted">
        Manage products, orders, and service bookings from the dedicated admin routes.
      </p>

      <div className="grid grid-categories">
        <article className="card">
          <div className="card-content">
            <h3>Products</h3>
            <p className="price">{loading ? '...' : summary.products}</p>
            <a className="btn btn-secondary" href="/admin/products">Manage products</a>
          </div>
        </article>

        <article className="card">
          <div className="card-content">
            <h3>Orders</h3>
            <p className="price">{loading ? '...' : summary.orders}</p>
            <a className="btn btn-secondary" href="/admin/orders">Manage orders</a>
          </div>
        </article>

        <article className="card">
          <div className="card-content">
            <h3>Service bookings</h3>
            <p className="price">{loading ? '...' : summary.bookings}</p>
            <a className="btn btn-secondary" href="/admin/service-bookings">Manage bookings</a>
          </div>
        </article>
      </div>

      {error ? <p className="status error">{error}</p> : null}
      <p className="section-muted">
        Admin authentication uses <strong>X-Admin-Api-Key</strong>. Set your key in frontend
        <code> VITE_ADMIN_API_KEY </code> to access protected endpoints.
      </p>
    </section>
  )
}

export default AdminDashboardPage
