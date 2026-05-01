function Layout({ cartItemsCount, children }) {
  return (
    <div className="app-shell">
      <div className="layout">
        <header className="topbar">
          <a className="brand" href="/">
            MADS
          </a>
          <nav className="menu">
            <a href="/">Home</a>
            <a href="/product-category/electric-scooters">Shop</a>
            <a href="/services">Services</a>
            <a href="/checkout">Checkout ({cartItemsCount})</a>
            <a href="/about-us">About</a>
            <a href="/admin">Admin</a>
          </nav>
        </header>
        {children}
        <footer className="footer">
          <p>MADS e-shop demo - React + ASP.NET Core + PostgreSQL</p>
        </footer>
      </div>
    </div>
  )
}

export default Layout
