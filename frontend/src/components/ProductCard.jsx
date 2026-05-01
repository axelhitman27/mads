import { formatCurrency } from '../lib/format'

function ProductCard({ product, onAddToCart, compact = false, showCategory = false }) {
  const isInStock = typeof product.isInStock === 'boolean'
    ? product.isInStock
    : (product.stockQuantity ?? 0) > 0
  const statusText = product.status?.label ?? product.status?.value ?? product.status ?? 'Available'

  return (
    <article className="card">
      {!compact ? <img src={product.imageUrl} alt={product.name} className="product-image" /> : null}
      <div className="card-content">
        <div className={isInStock ? 'badge badge-success' : 'badge badge-danger'}>
          {isInStock ? 'In stock' : statusText}
        </div>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        {showCategory ? <p className="section-muted">{product.categoryName || product.category || '-'}</p> : null}
        <div className="product-price-row">
          <span className="price">{formatCurrency(product.price, product.currency)}</span>
          <div className="actions">
            <a className="btn btn-secondary" href={`/product/${product.slug}`}>
              Details
            </a>
            <button
              className="btn btn-primary"
              type="button"
              disabled={!isInStock}
              onClick={() => onAddToCart(product)}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
