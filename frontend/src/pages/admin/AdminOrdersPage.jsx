import { useEffect, useState } from 'react'
import {
  adminGetOrderById,
  adminGetOrders,
  adminUpdateOrderStatus,
} from '../../lib/api'
import { formatCurrency, formatDateTime } from '../../lib/format'

const ORDER_STATUSES = ['Pending', 'Reviewed', 'Processing', 'Completed', 'Cancelled']

function AdminOrdersPage({ onDataChanged }) {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const loadOrders = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminGetOrders()
      setOrders(data)
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, nextStatus) => {
    setStatusMessage('')
    setError('')
    try {
      await adminUpdateOrderStatus(orderId, nextStatus)
      setStatusMessage('Order status updated.')
      await loadOrders()
      onDataChanged?.()
    } catch (updateError) {
      setError(updateError.message)
    }
  }

  const openOrderDetails = async (orderId) => {
    setLoadingDetail(true)
    setError('')
    try {
      const detail = await adminGetOrderById(orderId)
      setSelectedOrder(detail)
    } catch (detailError) {
      setError(detailError.message)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <section className="stack">
      <div className="actions">
        <h2>Orders</h2>
        <button type="button" className="btn btn-secondary" onClick={loadOrders}>
          Refresh
        </button>
      </div>

      {error ? <p className="status error">{error}</p> : null}
      {statusMessage ? <p className="status success">{statusMessage}</p> : null}

      {loading ? (
        <p className="status">Loading orders...</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <small>{order.email}</small>
                  </td>
                  <td>{formatCurrency(order.totalAmount, order.currency)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{order.itemCount}</td>
                  <td>{formatDateTime(order.createdAtUtc)}</td>
                  <td>
                    <button type="button" className="btn btn-secondary" onClick={() => openOrderDetails(order.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <article className="panel">
        <h3>Order details</h3>
        {loadingDetail ? <p className="status">Loading order details...</p> : null}
        {!loadingDetail && !selectedOrder ? (
          <p className="status">Select an order to inspect line items and delivery information.</p>
        ) : null}
        {!loadingDetail && selectedOrder ? (
          <div className="stack">
            <p>
              <strong>Customer:</strong> {selectedOrder.customerName} ({selectedOrder.email})
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone || '-'}
            </p>
            <p>
              <strong>Delivery address:</strong> {selectedOrder.deliveryAddress}
            </p>
            <p>
              <strong>Notes:</strong> {selectedOrder.notes || '-'}
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(selectedOrder.totalAmount, selectedOrder.currency)}
            </p>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={`${selectedOrder.id}-${item.productId}-${item.sku ?? 'nosku'}`}>
                      <td>{item.productName}</td>
                      <td>{item.sku || '-'}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice, selectedOrder.currency)}</td>
                      <td>{formatCurrency(item.lineTotal, selectedOrder.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  )
}

export default AdminOrdersPage
