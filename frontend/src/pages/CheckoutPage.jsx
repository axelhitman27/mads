import { useMemo, useState } from 'react'
import { createOrder } from '../lib/api'
import { formatCurrency } from '../lib/format'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  deliveryAddress: '',
  notes: '',
}

function CheckoutPage({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const submitOrder = async (event) => {
    event.preventDefault()
    if (cartItems.length === 0) {
      setStatus('error')
      setMessage('Your cart is empty.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      await createOrder({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        notes: form.notes.trim() || null,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      })

      onClearCart()
      setForm(initialForm)
      setStatus('success')
      setMessage('Order request submitted successfully. We will contact you shortly.')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Failed to submit order.')
    }
  }

  return (
    <section className="section">
      <h1>Checkout</h1>
      <p className="section-muted">Finalize your order and send the request to MADS.</p>

      <div className="split">
        <div className="panel">
          <h2>Cart</h2>

          {cartItems.length === 0 ? (
            <p className="status">Your cart is empty.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, item.stockQuantity ?? 1)}
                          value={item.quantity}
                          onChange={(event) => onUpdateQuantity(item.id, Number(event.target.value))}
                        />
                      </td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p>
            <strong>Total:</strong> {formatCurrency(total)}
          </p>
        </div>

        <div className="panel">
          <h2>Customer details</h2>
          <form className="field-grid" onSubmit={submitOrder}>
            <div className="field">
              <label htmlFor="checkout-full-name">Full name</label>
              <input
                id="checkout-full-name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkout-email">Email</label>
              <input
                id="checkout-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkout-phone">Phone</label>
              <input
                id="checkout-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkout-address">Delivery address</label>
              <textarea
                id="checkout-address"
                name="deliveryAddress"
                rows={3}
                value={form.deliveryAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="checkout-notes">Notes (optional)</label>
              <textarea
                id="checkout-notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
              />
            </div>

            <div className="actions">
              <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : 'Submit order request'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClearCart}>
                Clear cart
              </button>
            </div>

            {message ? <p className={`status ${status === 'error' ? 'error' : 'success'}`}>{message}</p> : null}
          </form>
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage
