import { useEffect, useMemo, useState } from 'react'
import { getHomeData, getProductsByCategorySlug, sendContactMessage } from './api'
import './App.css'

const currencyFormatter = new Intl.NumberFormat('el-GR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
})

const initialContactState = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
}

const ELECTRIC_SCOOTERS_SLUG = 'electric-scooters'
const SCOOTER_SLUG_ALIASES = new Set([
  ELECTRIC_SCOOTERS_SLUG,
  'ηλεκτρικά-πατίνια',
  'ilektrika-patinia',
])

const getCurrentPage = () => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean)
  if (pathSegments[0] === 'product-category' && pathSegments[1]) {
    const requestedSlug = decodeURIComponent(pathSegments[1]).trim().toLowerCase()
    const normalizedSlug = SCOOTER_SLUG_ALIASES.has(requestedSlug)
      ? ELECTRIC_SCOOTERS_SLUG
      : requestedSlug
    return { type: 'category', slug: normalizedSlug }
  }

  if (pathSegments[0] === 'about-us') {
    return { type: 'about' }
  }

  return { type: 'home' }
}

function HomePage() {
  const [homeData, setHomeData] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [contactData, setContactData] = useState(initialContactState)
  const [isSendingContact, setIsSendingContact] = useState(false)
  const [contactFeedback, setContactFeedback] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadData = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const home = await getHomeData({ signal: abortController.signal })
        const products = home?.allProducts ?? []
        setHomeData(home)
        setAllProducts(products)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage('Could not load data. Please check backend API status.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => abortController.abort()
  }, [])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts
    }

    return allProducts.filter((product) => product.categoryId === selectedCategory)
  }, [allProducts, selectedCategory])

  const handleContactChange = (event) => {
    const { name, value } = event.target
    setContactData((previous) => ({ ...previous, [name]: value }))
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setContactFeedback('')
    setIsSendingContact(true)

    try {
      await sendContactMessage(contactData)

      setContactData(initialContactState)
      setContactFeedback('Thank you. Your request has been submitted.')
    } catch {
      setContactFeedback('Submission failed. Please call us directly.')
    } finally {
      setIsSendingContact(false)
    }
  }

  if (loading) {
    return <main className="page-status">Loading new MADS experience...</main>
  }

  if (errorMessage) {
    return <main className="page-status error">{errorMessage}</main>
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">{homeData.brand}</div>
        <nav className="menu">
          <a href="/">Home</a>
          <a href="/product-category/electric-scooters">E-Scooters</a>
          <a href="/about-us">About Us</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <p className="eyebrow">{homeData.tagline}</p>
          <h1>{homeData.heroTitle}</h1>
          <p className="lead">{homeData.heroSubtitle}</p>
          <div className="cta-group">
            <a href="/product-category/electric-scooters" className="btn btn-primary">
              Explore Scooters
            </a>
            <a href="#services" className="btn btn-secondary">
              Book Service
            </a>
          </div>
        </section>

        <section className="section">
          <h2>Shop categories</h2>
          <div className="grid categories">
            {homeData.categories.map((category) => (
              <article key={category.id} className="card category-card">
                <img src={category.imageUrl} alt={category.name} />
                <div className="card-body">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <a className="category-link" href={`/product-category/${category.slug}`}>
                    View category
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="products" className="section">
          <div className="section-heading">
            <h2>Featured products</h2>
            <p>Preview products that can launch with your redesigned store.</p>
          </div>
          <div className="grid products">
            {homeData.featuredProducts.map((product) => (
              <article key={product.id} className="card product-card">
                <img src={product.imageUrl} alt={product.name} />
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="price-row">
                    <strong>{currencyFormatter.format(product.price)}</strong>
                    <span>{product.category}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h2>All products</h2>
            <p>Simple category filtering for catalog browsing.</p>
          </div>
          <div className="filter-row">
            <button
              type="button"
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {homeData.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={selectedCategory === category.id ? 'active' : ''}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="grid products compact">
            {filteredProducts.map((product) => (
              <article key={product.id} className="card product-card compact-card">
                <div className="card-body">
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription ?? product.description}</p>
                  <strong>{currencyFormatter.format(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="section">
          <h2>Technical services</h2>
          <div className="grid services">
            {homeData.services.map((service) => (
              <article key={service.id} className="card service-card">
                <div className="card-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-meta">
                    <span>From {currencyFormatter.format(service.priceFrom)}</span>
                    <span>{service.duration}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <h2>Request a callback</h2>
          <p>
            Use this form to collect leads while you present the new design to your customer.
          </p>
          <form onSubmit={handleContactSubmit} className="contact-form">
            <input
              name="fullName"
              placeholder="Full name"
              value={contactData.fullName}
              onChange={handleContactChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={contactData.email}
              onChange={handleContactChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              value={contactData.phone}
              onChange={handleContactChange}
            />
            <textarea
              name="message"
              placeholder="What scooter or service do you need?"
              value={contactData.message}
              onChange={handleContactChange}
              rows={5}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={isSendingContact}>
              {isSendingContact ? 'Sending...' : 'Send request'}
            </button>
            {contactFeedback && <p className="feedback">{contactFeedback}</p>}
          </form>
        </section>
      </main>

      <footer className="footer">
        <p>
          {homeData.brand} - Concept redesign built with React + ASP.NET Core + PostgreSQL
        </p>
      </footer>
    </div>
  )
}

function ProductCategoryPage({ slug }) {
  const [homeData, setHomeData] = useState(null)
  const [products, setProducts] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadData = async () => {
      setLoading(true)
      setErrorMessage('')
      try {
        const [home, categoryProducts] = await Promise.all([
          getHomeData({ signal: abortController.signal }),
          getProductsByCategorySlug(slug, { signal: abortController.signal }),
        ])
        setHomeData(home)
        setProducts(categoryProducts)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErrorMessage('Could not load category products. Please check backend API status.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
    return () => abortController.abort()
  }, [slug])

  const category = useMemo(
    () => homeData?.categories?.find((item) => item.slug === slug) ?? null,
    [homeData, slug],
  )

  const sortedProducts = useMemo(() => {
    const sortableProducts = [...products]

    switch (sortBy) {
      case 'price-asc':
        return sortableProducts.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return sortableProducts.sort((a, b) => b.price - a.price)
      case 'name':
        return sortableProducts.sort((a, b) => a.name.localeCompare(b.name, 'el'))
      case 'featured':
      default:
        return sortableProducts.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) {
            return a.name.localeCompare(b.name, 'el')
          }
          return a.isFeatured ? -1 : 1
        })
    }
  }, [products, sortBy])

  if (loading) {
    return <main className="page-status">Loading category products...</main>
  }

  if (errorMessage) {
    return <main className="page-status error">{errorMessage}</main>
  }

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">{homeData?.brand ?? 'MADS'}</div>
        <nav className="menu">
          <a href="/">Home</a>
          <a href="/product-category/electric-scooters">E-Scooters</a>
          <a href="/about-us">About Us</a>
          <a href="/#services">Services</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="category-hero">
          <p className="breadcrumbs">
            <a href="/">Αρχική</a> / <span>Ηλεκτρικά Πατίνια</span>
          </p>
          <h1>{category?.name ?? 'Ηλεκτρικά Πατίνια'}</h1>
          <p>{category?.description ?? 'Ανακαλύψτε νέες αφίξεις και best sellers σε e-scooters.'}</p>
        </section>

        <section className="section">
          <div className="shop-layout">
            <aside className="shop-sidebar">
              <h2>Κατηγορίες</h2>
              <div className="category-link-list">
                {homeData?.categories?.map((item) => (
                  <a
                    key={item.id}
                    href={`/product-category/${item.slug}`}
                    className={item.slug === slug ? 'active' : ''}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </aside>

            <div className="shop-content">
              <div className="products-toolbar">
                <p>
                  Εμφανίζονται <strong>{sortedProducts.length}</strong> προϊόντα
                </p>
                <label className="sort-field">
                  Ταξινόμηση
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="featured">Προτεινόμενα</option>
                    <option value="price-asc">Τιμή: Χαμηλή σε Υψηλή</option>
                    <option value="price-desc">Τιμή: Υψηλή σε Χαμηλή</option>
                    <option value="name">Αλφαβητικά</option>
                  </select>
                </label>
              </div>

              <div className="grid products">
                {sortedProducts.map((product) => (
                  <article key={product.id} className="card product-card category-product-card">
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="card-body">
                      <h3>{product.name}</h3>
                      <p>{product.shortDescription ?? product.description}</p>
                      <div className="price-row">
                        <strong>{currencyFormatter.format(product.price)}</strong>
                        <span>{product.isFeatured ? 'Featured' : 'In stock'}</span>
                      </div>
                      <button type="button" className="btn btn-secondary product-cta">
                        Προσθήκη στο καλάθι
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Demo category page inspired by mads.gr product category layout</p>
      </footer>
    </div>
  )
}

function AboutUsPage() {
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">MADS</div>
        <nav className="menu">
          <a href="/">Home</a>
          <a href="/product-category/electric-scooters">E-Scooters</a>
          <a href="/about-us">About Us</a>
          <a href="/#services">Services</a>
          <a href="/#contact">Contact</a>
        </nav>
      </header>

      <main className="about-page">
        <section className="about-hero">
          <p className="eyebrow">Σχετικά με εμάς</p>
          <h1>Η τεχνογνωσία συναντά την εξέλιξη</h1>
          <p>
            Η MADS ιδρύθηκε το 2017 και δραστηριοποιείται στον χώρο των μπαταριών παντός τύπου.
            Από το 2018 εξειδικευόμαστε στην επισκευή, συντήρηση και βελτίωση ηλεκτρικών
            πατινιών και ηλεκτρικών σκούτερ, προσφέροντας ολοκληρωμένες λύσεις για κάθε ανάγκη.
          </p>
        </section>

        <section className="section">
          <div className="about-grid">
            <article className="card about-card">
              <div className="card-body">
                <h2>Η αποστολή μας</h2>
                <p>
                  Ως επίσημη αντιπροσωπεία, διαθέτουμε πλήρη γκάμα ηλεκτρικών πατινιών και
                  ηλεκτρικών σκούτερ, με τεχνική υποστήριξη, κάλυψη εγγύησης και γνήσια
                  ανταλλακτικά για όλα τα προϊόντα.
                </p>
              </div>
            </article>

            <article className="card about-card">
              <div className="card-body">
                <h2>Γιατί MADS</h2>
                <p>
                  Με εμπειρία στις μπαταρίες και τεχνογνωσία στα ηλεκτρικά οχήματα, προσφέρουμε
                  ασφάλεια, ποιότητα και αξιόπιστη εξυπηρέτηση πριν και μετά την αγορά.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <article className="card about-card">
            <div className="card-body">
              <h2>Οι υπηρεσίες μας</h2>
              <ul className="about-list">
                <li>Πώληση ηλεκτρικών πατινιών και ηλεκτρικών σκούτερ</li>
                <li>Τεχνική υποστήριξη, επισκευές και συντήρηση</li>
                <li>Κάλυψη εγγύησης για όλα τα προϊόντα</li>
                <li>Μεγάλη ποικιλία γνήσιων ανταλλακτικών και μπαταριών</li>
                <li>Εξειδικευμένες λύσεις βελτίωσης επιδόσεων και αυτονομίας</li>
              </ul>
            </div>
          </article>
        </section>

        <section className="section">
          <div className="about-grid">
            <article className="card about-card">
              <div className="card-body">
                <h2>Κατάστημα</h2>
                <p>Λεωνίδα Ιασωνίδου 23, Θεσσαλονίκη</p>
                <p>Τηλέφωνο: <a className="inline-link" href="tel:2310262805">2310 262805</a></p>
                <p>Email: <a className="inline-link" href="mailto:info@mads.gr">info@mads.gr</a></p>
              </div>
            </article>

            <article className="card about-card">
              <div className="card-body">
                <h2>Ωράριο λειτουργίας</h2>
                <ul className="hours-list">
                  <li><span>Δευτέρα</span><span>09:00 - 16:00</span></li>
                  <li><span>Τρίτη</span><span>09:00 - 20:00</span></li>
                  <li><span>Τετάρτη</span><span>09:00 - 16:00</span></li>
                  <li><span>Πέμπτη</span><span>09:00 - 20:00</span></li>
                  <li><span>Παρασκευή</span><span>09:00 - 20:00</span></li>
                  <li><span>Σάββατο</span><span>10:00 - 15:00</span></li>
                  <li><span>Κυριακή</span><span>Κλειστά</span></li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <article className="about-cta">
            <h2>Κλείστε ραντεβού για service</h2>
            <p>
              Επικοινωνήστε μαζί μας για να γνωρίσετε τα προϊόντα και τις υπηρεσίες μας ή για να
              κλείσετε άμεσα το επόμενο service του πατινιού σας.
            </p>
            <a className="btn btn-primary" href="tel:2310262805">
              Θέλω να κλείσω ραντεβού
            </a>
          </article>
        </section>
      </main>

      <footer className="footer">
        <p>Στη MADS, η ηλεκτροκίνηση γίνεται υπόθεση ζωής.</p>
      </footer>
    </div>
  )
}

function App() {
  const currentPage = useMemo(() => getCurrentPage(), [])

  if (currentPage.type === 'category') {
    return <ProductCategoryPage slug={currentPage.slug} />
  }

  if (currentPage.type === 'about') {
    return <AboutUsPage />
  }

  return <HomePage />
}

export default App
