import { useEffect, useMemo, useState } from 'react'
import { getHomeData } from '../lib/api'
import ProductCard from '../components/ProductCard'
import { formatCurrency } from '../lib/format'

function HomePage({ onAddToCart }) {
  const [homeData, setHomeData] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true
    const abortController = new AbortController()

    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getHomeData({ signal: abortController.signal })
        if (isActive) {
          setHomeData(data)
        }
      } catch (loadError) {
        if (isActive && loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load e-shop data. Check backend API.')
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isActive = false
      abortController.abort()
    }
  }, [])

  const products = homeData?.products ?? []
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products
    }
    return products.filter((item) => item.categoryId === selectedCategory)
  }, [products, selectedCategory])

  if (loading) {
    return <main className="status">Loading e-shop...</main>
  }

  if (error || !homeData) {
    return <main className="status error">{error || 'Unable to load data.'}</main>
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">{homeData.tagline}</p>
        <h1>{homeData.heroTitle}</h1>
        <p className="lead">{homeData.heroSubtitle}</p>
        <div className="actions">
          <a className="btn btn-primary" href="/product-category/electric-scooters">
            Shop scooters
          </a>
          <a className="btn btn-secondary" href="/services">
            Book service
          </a>
        </div>
      </section>

      <section className="section">
        <h2>Shop categories</h2>
        <div className="grid grid-categories">
          {homeData.categories.map((category) => (
            <article key={category.id} className="card">
              <img className="product-image" src={category.imageUrl} alt={category.name} />
              <div className="card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <a className="btn btn-secondary" href={`/product-category/${category.slug}`}>
                  View category
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Featured products</h2>
        <p className="section-muted">New scooters and most requested models.</p>
        <div className="grid grid-products">
          {homeData.featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                isInStock: product.stockQuantity > 0 && product.status !== 'OutOfStock',
              }}
              onAddToCart={onAddToCart}
              showCategory
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Catalog preview</h2>
        <div className="toolbar">
          <button
            type="button"
            className={selectedCategory === 'all' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {homeData.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={selectedCategory === category.id ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="grid grid-products">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                isInStock: product.stockQuantity > 0 && product.status !== 'OutOfStock',
              }}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Service highlights</h2>
        <div className="grid grid-services">
          {homeData.services.map((service) => (
            <article key={service.id} className="panel">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="product-price-row">
                <strong className="price">From {formatCurrency(service.basePrice, service.currency)}</strong>
                <span>{service.estimatedDuration}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage
