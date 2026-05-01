import { useMemo } from 'react'
import { usePathname } from './hooks/usePathname'
import { useCart } from './hooks/useCart'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductCatalogPage from './pages/ProductCatalogPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import ServicesPage from './pages/ServicesPage'
import CheckoutPage from './pages/CheckoutPage'
import AboutPage from './pages/AboutPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminServiceBookingsPage from './pages/admin/AdminServiceBookingsPage'

const normalizeCategorySlug = (rawSlug) => {
  const decodedSlug = decodeURIComponent(rawSlug).trim().toLowerCase()
  if (decodedSlug === 'ηλεκτρικά-πατίνια' || decodedSlug === 'ilektrika-patinia') {
    return 'electric-scooters'
  }
  return decodedSlug
}

function App() {
  const pathname = usePathname()
  const cart = useCart()

  const parsedRoute = useMemo(() => {
    const [pathOnly] = pathname.split('?')
    const query = pathname.includes('?') ? pathname.split('?')[1] : ''
    const queryParams = new URLSearchParams(query)
    const segments = pathOnly.split('/').filter(Boolean)

    if (segments[0] === 'product-category' && segments[1]) {
      return {
        route: 'catalog',
        categorySlug: normalizeCategorySlug(segments[1]),
      }
    }

    if (segments[0] === 'product' && segments[1]) {
      return {
        route: 'product-details',
        productSlug: decodeURIComponent(segments[1]).trim().toLowerCase(),
      }
    }

    if (segments[0] === 'shop') {
      const categoryFromQuery = queryParams.get('category')
      return {
        route: 'catalog',
        categorySlug: categoryFromQuery ? normalizeCategorySlug(categoryFromQuery) : '',
      }
    }

    if (segments[0] === 'services') {
      return { route: 'services' }
    }

    if (segments[0] === 'checkout') {
      return { route: 'checkout' }
    }

    if (segments[0] === 'about-us') {
      return { route: 'about' }
    }

    if (segments[0] === 'admin') {
      if (segments[1] === 'products') {
        return { route: 'admin-products' }
      }
      if (segments[1] === 'orders') {
        return { route: 'admin-orders' }
      }
      if (segments[1] === 'service-bookings') {
        return { route: 'admin-service-bookings' }
      }
      return { route: 'admin-dashboard' }
    }

    return { route: 'home' }
  }, [pathname])

  if (parsedRoute.route === 'admin-products') {
    return <AdminProductsPage />
  }

  if (parsedRoute.route === 'admin-orders') {
    return <AdminOrdersPage />
  }

  if (parsedRoute.route === 'admin-service-bookings') {
    return <AdminServiceBookingsPage />
  }

  if (parsedRoute.route === 'admin-dashboard') {
    return <AdminDashboardPage />
  }

  return (
    <Layout cartItemsCount={cart.itemCount}>
      {parsedRoute.route === 'home' ? (
        <HomePage onAddToCart={cart.addItem} />
      ) : null}

      {parsedRoute.route === 'catalog' ? (
        <ProductCatalogPage
          categorySlug={parsedRoute.categorySlug}
          onAddToCart={cart.addItem}
        />
      ) : null}

      {parsedRoute.route === 'product-details' ? (
        <ProductDetailsPage
          productSlug={parsedRoute.productSlug}
          onAddToCart={cart.addItem}
        />
      ) : null}

      {parsedRoute.route === 'services' ? <ServicesPage /> : null}

      {parsedRoute.route === 'checkout' ? (
        <CheckoutPage
          cartItems={cart.items}
          onUpdateQuantity={cart.updateQuantity}
          onRemoveItem={cart.removeItem}
          onClearCart={cart.clearCart}
        />
      ) : null}

      {parsedRoute.route === 'about' ? <AboutPage /> : null}
    </Layout>
  )
}

export default App
