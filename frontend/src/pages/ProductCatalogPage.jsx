import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { getShopProducts } from '../lib/api'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
]

function ProductCatalogPage({ categorySlug, onAddToCart }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const abortController = new AbortController()

    const load = async () => {
      if (active) {
        setLoading(true)
        setError('')
      }

      try {
        const data = await getShopProducts(
          {
            categorySlug: categorySlug || undefined,
            query: search || undefined,
          },
          { signal: abortController.signal },
        )

        if (!active) {
          return
        }

        setProducts(data)
      } catch (loadError) {
        if (active && loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load catalog products.')
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
  }, [categorySlug, search])

  const sortedProducts = useMemo(() => {
    const clone = [...products]

    switch (sortBy) {
      case 'price-asc':
        return clone.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return clone.sort((a, b) => b.price - a.price)
      case 'name':
        return clone.sort((a, b) => a.name.localeCompare(b.name, 'el'))
      case 'featured':
      default:
        return clone.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) {
            return a.name.localeCompare(b.name, 'el')
          }
          return a.isFeatured ? -1 : 1
        })
    }
  }, [products, sortBy])

  if (loading) {
    return <main className="status">Loading product catalog...</main>
  }

  if (error) {
    return <main className="status error">{error}</main>
  }

  return (
    <section className="section">
      <h2>{categorySlug ? `Category: ${categorySlug}` : 'All products'}</h2>
      <p className="section-muted">Discover available scooters, bikes, accessories and spare parts.</p>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-products">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} showCategory />
        ))}
      </div>
    </section>
  )
}

export default ProductCatalogPage
