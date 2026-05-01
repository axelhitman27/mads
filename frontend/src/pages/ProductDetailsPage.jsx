import { useEffect, useState } from 'react'
import { getShopProductBySlug } from '../lib/api'
import { formatCurrency } from '../lib/format'

function ProductDetailsPage({ productSlug, onAddToCart }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true
    const abortController = new AbortController()

    const load = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const data = await getShopProductBySlug(productSlug, { signal: abortController.signal })
        if (active) {
          setProduct(data)
        }
      } catch (error) {
        if (active && error.name !== 'AbortError') {
          setErrorMessage(error.message || 'Could not load product details.')
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
  }, [productSlug])

  if (loading) {
    return <main className="status">Loading product details...</main>
  }

  if (!product || errorMessage) {
    return <main className="status error">{errorMessage || 'Product not found.'}</main>
  }

  return (
    <section className="section">
      <div className="split">
        <article className="card">
          <img className="product-image-detail" src={product.imageUrl} alt={product.name} />
        </article>
        <article className="panel">
          <h1>{product.name}</h1>
          <p className="section-muted">{product.shortDescription}</p>
          <p>{product.description}</p>
          <div className="price-block">
            <strong className="price-xl">{formatCurrency(product.price, product.currency)}</strong>
            {product.compareAtPrice ? (
              <span className="price-compare">{formatCurrency(product.compareAtPrice, product.currency)}</span>
            ) : null}
          </div>
          <p className={product.isInStock ? 'status success' : 'status error'}>
            {product.isInStock ? 'In stock' : 'Out of stock'}
          </p>
          <div className="actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!product.isInStock}
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </button>
            <a className="btn btn-secondary" href="/checkout">
              Go to checkout
            </a>
          </div>
        </article>
      </div>

      {product.characteristics?.length ? (
        <article className="panel section">
          <h2>Characteristics</h2>
          <div className="characteristics-grid">
            {product.characteristics.map((item) => (
              <div className="characteristic-row" key={`${item.label}-${item.sortOrder}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      ) : null}
    </section>
  )
}

export default ProductDetailsPage
