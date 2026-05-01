const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5048').replace(/\/$/, '')
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY ?? ''

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = 'Request failed'
    try {
      const payload = await response.json()
      errorMessage = payload?.message ?? payload?.title ?? errorMessage
    } catch {
      // ignore json parse errors
    }
    throw new Error(errorMessage)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  return handleResponse(response)
}

function adminHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'X-Admin-Api-Key': ADMIN_API_KEY,
    ...extra,
  }
}

export function getHomeData({ signal } = {}) {
  return request('/api/home', { signal })
}

export function getShopProducts(params = {}, { signal } = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return request(`/api/shop/products${suffix}`, { signal })
}

export function getShopProductBySlug(slug, { signal } = {}) {
  return request(`/api/shop/products/${encodeURIComponent(slug)}`, { signal })
}

export function getShopServices({ signal } = {}) {
  return request('/api/shop/services', { signal })
}

export function createServiceBooking(payload) {
  return request('/api/shop/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function createOrder(payload) {
  return request('/api/shop/checkout/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function adminGetProducts({ signal } = {}) {
  return request('/api/admin/products', {
    signal,
    headers: adminHeaders(),
  })
}

export function adminGetProductById(id, { signal } = {}) {
  return request(`/api/admin/products/${id}`, {
    signal,
    headers: adminHeaders(),
  })
}

export function adminCreateProduct(payload) {
  return request('/api/admin/products', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
}

export function adminUpdateProduct(id, payload) {
  return request(`/api/admin/products/${id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
}

export function adminUpdateProductStatus(id, status) {
  return request(`/api/admin/products/${id}/status`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  })
}

export function adminToggleProductPublish(id, isPublished) {
  return request(`/api/admin/products/${id}/publish`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify({ status: String(isPublished) }),
  })
}

export function adminDeleteProduct(id) {
  return request(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
}

export function adminGetOrders({ signal } = {}) {
  return request('/api/admin/orders', {
    signal,
    headers: adminHeaders(),
  })
}

export function adminGetOrderById(id, { signal } = {}) {
  return request(`/api/admin/orders/${id}`, {
    signal,
    headers: adminHeaders(),
  })
}

export function adminUpdateOrderStatus(id, status) {
  return request(`/api/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ status }),
  })
}

export function adminGetServiceBookings({ signal } = {}) {
  return request('/api/admin/service-bookings', {
    signal,
    headers: adminHeaders(),
  })
}

export function adminUpdateServiceBookingStatus(id, status, adminNotes = '') {
  return request(`/api/admin/service-bookings/${id}/status`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify({ status, adminNotes }),
  })
}
