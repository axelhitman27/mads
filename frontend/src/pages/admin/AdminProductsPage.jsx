import { useEffect, useMemo, useState } from 'react'
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProductById,
  adminGetProducts,
  adminToggleProductPublish,
  adminUpdateProduct,
  adminUpdateProductStatus,
  getHomeData,
} from '../../lib/api'

const emptyCharacteristic = { label: '', value: '', groupName: '', sortOrder: 1 }

const createInitialState = () => ({
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  compareAtPrice: '',
  currency: 'EUR',
  imageUrl: '',
  thumbnailUrl: '',
  sku: '',
  brand: 'MADS',
  modelCode: '',
  weightKg: '',
  batteryAh: '',
  rangeKm: '',
  topSpeedKmh: '',
  motorPowerW: '',
  warrantyMonths: 12,
  stockQuantity: 0,
  status: 'Draft',
  isPublished: false,
  isFeatured: false,
  displayOrder: 0,
  categoryId: '',
  characteristics: [emptyCharacteristic],
})

const toNumberOrNull = (value) => (value === '' ? null : Number(value))

function AdminProductsPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [formState, setFormState] = useState(createInitialState())
  const [editingProductId, setEditingProductId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [homeData, adminProducts] = await Promise.all([
        getHomeData(),
        adminGetProducts(),
      ])
      setCategories(homeData.categories ?? [])
      setProducts(adminProducts ?? [])
    } catch (requestError) {
      setError(requestError.message || 'Failed loading admin data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => b.id - a.id)
  }, [products])

  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const updateCharacteristic = (index, field, value) => {
    setFormState((previous) => {
      const next = [...previous.characteristics]
      next[index] = { ...next[index], [field]: value }
      return { ...previous, characteristics: next }
    })
  }

  const addCharacteristic = () => {
    setFormState((previous) => ({
      ...previous,
      characteristics: [
        ...previous.characteristics,
        { ...emptyCharacteristic, sortOrder: previous.characteristics.length + 1 },
      ],
    }))
  }

  const removeCharacteristic = (index) => {
    setFormState((previous) => {
      const next = previous.characteristics.filter((_, currentIndex) => currentIndex !== index)
      return {
        ...previous,
        characteristics: next.length > 0 ? next : [emptyCharacteristic],
      }
    })
  }

  const resetForm = () => {
    setEditingProductId(null)
    setFormState(createInitialState())
  }

  const toPayload = () => {
    return {
      name: formState.name.trim(),
      slug: formState.slug.trim(),
      shortDescription: formState.shortDescription.trim(),
      description: formState.description.trim(),
      price: Number(formState.price),
      compareAtPrice: toNumberOrNull(formState.compareAtPrice),
      currency: formState.currency.trim() || 'EUR',
      imageUrl: formState.imageUrl.trim(),
      thumbnailUrl: formState.thumbnailUrl.trim() || null,
      sku: formState.sku.trim() || null,
      brand: formState.brand.trim() || 'MADS',
      modelCode: formState.modelCode.trim() || null,
      weightKg: toNumberOrNull(formState.weightKg),
      batteryAh: toNumberOrNull(formState.batteryAh),
      rangeKm: toNumberOrNull(formState.rangeKm),
      topSpeedKmh: toNumberOrNull(formState.topSpeedKmh),
      motorPowerW: toNumberOrNull(formState.motorPowerW),
      warrantyMonths: Number(formState.warrantyMonths),
      stockQuantity: Number(formState.stockQuantity),
      status: formState.status,
      isPublished: formState.isPublished,
      isFeatured: formState.isFeatured,
      displayOrder: Number(formState.displayOrder),
      categoryId: Number(formState.categoryId),
      characteristics: formState.characteristics
        .map((characteristic, index) => ({
          label: characteristic.label.trim(),
          value: characteristic.value.trim(),
          groupName: characteristic.groupName?.trim() || null,
          sortOrder: characteristic.sortOrder === '' ? index + 1 : Number(characteristic.sortOrder),
        }))
        .filter((characteristic) => characteristic.label && characteristic.value),
    }
  }

  const validatePayload = (payload) => {
    if (!payload.name || !payload.slug || !payload.shortDescription || !payload.description) {
      return 'Please fill all mandatory text fields.'
    }
    if (!payload.categoryId || Number.isNaN(payload.categoryId)) {
      return 'Please select a category.'
    }
    if (!payload.imageUrl) {
      return 'Image URL is required.'
    }
    if (!payload.characteristics.length) {
      return 'Provide at least one characteristic.'
    }
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setFeedback('')

    const payload = toPayload()
    const validationError = validatePayload(payload)
    if (validationError) {
      setSaving(false)
      setError(validationError)
      return
    }

    try {
      if (editingProductId) {
        await adminUpdateProduct(editingProductId, payload)
        setFeedback('Product updated.')
      } else {
        await adminCreateProduct(payload)
        setFeedback('Product created.')
      }
      await loadData()
      resetForm()
    } catch (requestError) {
      setError(requestError.message || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  const editProduct = async (id) => {
    setError('')
    setFeedback('')
    try {
      const fullProduct = await adminGetProductById(id)
      setEditingProductId(fullProduct.id)
      setFormState({
        name: fullProduct.name,
        slug: fullProduct.slug,
        shortDescription: fullProduct.shortDescription,
        description: fullProduct.description,
        price: fullProduct.price,
        compareAtPrice: fullProduct.compareAtPrice ?? '',
        currency: fullProduct.currency,
        imageUrl: fullProduct.imageUrl,
        thumbnailUrl: fullProduct.thumbnailUrl ?? '',
        sku: fullProduct.sku ?? '',
        brand: fullProduct.brand ?? 'MADS',
        modelCode: fullProduct.modelCode ?? '',
        weightKg: fullProduct.weightKg ?? '',
        batteryAh: fullProduct.batteryAh ?? '',
        rangeKm: fullProduct.rangeKm ?? '',
        topSpeedKmh: fullProduct.topSpeedKmh ?? '',
        motorPowerW: fullProduct.motorPowerW ?? '',
        warrantyMonths: fullProduct.warrantyMonths ?? 12,
        stockQuantity: fullProduct.stockQuantity,
        status: fullProduct.status,
        isPublished: fullProduct.isPublished,
        isFeatured: fullProduct.isFeatured,
        displayOrder: fullProduct.displayOrder,
        categoryId: String(fullProduct.categoryId),
        characteristics:
          fullProduct.characteristics?.map((characteristic) => ({
            label: characteristic.label,
            value: characteristic.value,
            groupName: characteristic.groupName ?? '',
            sortOrder: characteristic.sortOrder,
          })) ?? [emptyCharacteristic],
      })
    } catch (requestError) {
      setError(requestError.message || 'Could not load product details.')
    }
  }

  const updateStatus = async (id, status) => {
    setError('')
    try {
      await adminUpdateProductStatus(id, status)
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'Could not update status.')
    }
  }

  const togglePublish = async (id, isPublished) => {
    setError('')
    try {
      await adminToggleProductPublish(id, !isPublished)
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'Could not toggle publish state.')
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return
    }
    setError('')
    try {
      await adminDeleteProduct(id)
      if (editingProductId === id) {
        resetForm()
      }
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'Could not delete product.')
    }
  }

  return (
    <div className="stack">
      <section className="section">
        <h1>Admin Products</h1>
        <p className="section-muted">
          Create, edit, publish/unpublish, update stock status and mark out of stock products.
        </p>
      </section>

      {error ? <p className="status error">{error}</p> : null}
      {feedback ? <p className="status success">{feedback}</p> : null}

      <section className="split">
        <article className="panel">
          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={loadData}>
              Refresh
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              New product
            </button>
          </div>
          <div className="table-wrap" style={{ marginTop: '0.7rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5}>Loading...</td>
                  </tr>
                ) : sortedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No products yet.</td>
                  </tr>
                ) : (
                  sortedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                        <div className="section-muted">{product.shortDescription}</div>
                      </td>
                      <td>{product.status}</td>
                      <td>
                        {product.price.toFixed(2)} {product.currency}
                      </td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <div className="actions">
                          <button type="button" className="btn btn-secondary" onClick={() => editProduct(product.id)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => updateStatus(product.id, 'OutOfStock')}
                          >
                            OOS
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => updateStatus(product.id, 'Active')}
                          >
                            Active
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => togglePublish(product.id, product.isPublished)}
                          >
                            {product.isPublished ? 'Disable' : 'Enable'}
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={() => deleteProduct(product.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <h2>{editingProductId ? 'Edit product' : 'Create product'}</h2>
          <form className="stack" onSubmit={submit}>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" value={formState.name} onChange={updateField} required />
              </div>
              <div className="field">
                <label htmlFor="slug">Slug</label>
                <input id="slug" name="slug" value={formState.slug} onChange={updateField} required />
              </div>
              <div className="field">
                <label htmlFor="categoryId">Category</label>
                <select id="categoryId" name="categoryId" value={formState.categoryId} onChange={updateField} required>
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="price">Price</label>
                <input id="price" name="price" type="number" step="0.01" value={formState.price} onChange={updateField} required />
              </div>
              <div className="field">
                <label htmlFor="compareAtPrice">Compare at price</label>
                <input id="compareAtPrice" name="compareAtPrice" type="number" step="0.01" value={formState.compareAtPrice} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="stockQuantity">Stock quantity</label>
                <input id="stockQuantity" name="stockQuantity" type="number" value={formState.stockQuantity} onChange={updateField} required />
              </div>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formState.status} onChange={updateField}>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="OutOfStock">OutOfStock</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="displayOrder">Display order</label>
                <input id="displayOrder" name="displayOrder" type="number" value={formState.displayOrder} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="currency">Currency</label>
                <input id="currency" name="currency" value={formState.currency} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="sku">SKU</label>
                <input id="sku" name="sku" value={formState.sku} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="brand">Brand</label>
                <input id="brand" name="brand" value={formState.brand} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="modelCode">Model code</label>
                <input id="modelCode" name="modelCode" value={formState.modelCode} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="weightKg">Weight (kg)</label>
                <input id="weightKg" name="weightKg" type="number" step="0.01" value={formState.weightKg} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="batteryAh">Battery (Ah)</label>
                <input id="batteryAh" name="batteryAh" type="number" step="0.01" value={formState.batteryAh} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="rangeKm">Range (km)</label>
                <input id="rangeKm" name="rangeKm" type="number" step="0.01" value={formState.rangeKm} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="topSpeedKmh">Top speed (km/h)</label>
                <input id="topSpeedKmh" name="topSpeedKmh" type="number" step="0.01" value={formState.topSpeedKmh} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="motorPowerW">Motor power (W)</label>
                <input id="motorPowerW" name="motorPowerW" type="number" step="0.01" value={formState.motorPowerW} onChange={updateField} />
              </div>
              <div className="field">
                <label htmlFor="warrantyMonths">Warranty (months)</label>
                <input id="warrantyMonths" name="warrantyMonths" type="number" value={formState.warrantyMonths} onChange={updateField} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="shortDescription">Short description</label>
              <textarea id="shortDescription" name="shortDescription" rows={3} value={formState.shortDescription} onChange={updateField} required />
            </div>
            <div className="field">
              <label htmlFor="description">Full description</label>
              <textarea id="description" name="description" rows={5} value={formState.description} onChange={updateField} required />
            </div>
            <div className="field">
              <label htmlFor="imageUrl">Image URL</label>
              <input id="imageUrl" name="imageUrl" value={formState.imageUrl} onChange={updateField} required />
            </div>
            <div className="field">
              <label htmlFor="thumbnailUrl">Thumbnail URL</label>
              <input id="thumbnailUrl" name="thumbnailUrl" value={formState.thumbnailUrl} onChange={updateField} />
            </div>

            <div className="actions">
              <label className="inline">
                <input type="checkbox" name="isPublished" checked={formState.isPublished} onChange={updateField} />
                Published
              </label>
              <label className="inline">
                <input type="checkbox" name="isFeatured" checked={formState.isFeatured} onChange={updateField} />
                Featured
              </label>
            </div>

            <div className="panel">
              <h3>Characteristics</h3>
              <div className="stack">
                {formState.characteristics.map((characteristic, index) => (
                  <div key={`${index}-${characteristic.label}`} className="field-grid">
                    <input
                      placeholder="Label"
                      value={characteristic.label}
                      onChange={(event) => updateCharacteristic(index, 'label', event.target.value)}
                    />
                    <input
                      placeholder="Value"
                      value={characteristic.value}
                      onChange={(event) => updateCharacteristic(index, 'value', event.target.value)}
                    />
                    <input
                      placeholder="Group"
                      value={characteristic.groupName}
                      onChange={(event) => updateCharacteristic(index, 'groupName', event.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Sort"
                      value={characteristic.sortOrder}
                      onChange={(event) => updateCharacteristic(index, 'sortOrder', event.target.value)}
                    />
                    <button type="button" className="btn btn-secondary" onClick={() => removeCharacteristic(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addCharacteristic}>
                  Add characteristic
                </button>
              </div>
            </div>

            <div className="actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : editingProductId ? 'Update product' : 'Create product'}
              </button>
              {editingProductId ? (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}

export default AdminProductsPage
