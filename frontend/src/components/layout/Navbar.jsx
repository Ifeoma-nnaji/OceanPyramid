import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/ocean-pyramid-logo.jpeg'
import './Navbar.css'

function getAccountDestination(role) {
  if (['super_admin', 'admin'].includes(role)) return '/admin/dashboard'
  if (role === 'customer') return '/my-account'
  return '/dashboard'
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
  }

  const dashboardLink = getAccountDestination(user?.role)
  const dashboardLabel = user?.role === 'customer'
    ? 'My Account'
    : ['super_admin', 'admin'].includes(user?.role)
      ? 'Admin Dashboard'
      : 'My Dashboard'

  const links = [
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Short Let', href: '/short-let' },
    { name: 'Land', href: '/land' },
    { name: 'Commercial', href: '/commercial' },
    { name: 'Agents', href: '/agents' },
    { name: 'About Us', href: '/#about' },
  ]

  return (
    <header className="site-header">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Ocean Pyramids Properties" />
        </Link>

        <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {links.map((link) => (
            <Link key={link.name} to={link.href} className="navbar-link" onClick={closeMenu}>
              {link.name}
            </Link>
          ))}
          <Link to="/login" className="navbar-link mobile-account-link" onClick={closeMenu}>Log In</Link>
          <Link to="/register" className="navbar-link mobile-account-link" onClick={closeMenu}>Sign Up</Link>
          {isAuthenticated && (
            <>
              <Link to={dashboardLink} className="navbar-link mobile-account-link" onClick={closeMenu}>{dashboardLabel}</Link>
              <button type="button" className="navbar-link mobile-account-link mobile-logout" onClick={handleLogout}>Log Out</button>
            </>
          )}
          <Link to="/list-property" className="navbar-list-property mobile-list-property" onClick={closeMenu}>List Your Property</Link>
          <a href="/#contact" className="navbar-mobile-contact" onClick={closeMenu}>Contact Us</a>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-login">Log In</Link>
          <Link to="/register" className="navbar-register">Sign Up</Link>
          {isAuthenticated && (
            <>
              <Link to={dashboardLink} className="navbar-login">{dashboardLabel}</Link>
              <button type="button" className="navbar-contact" onClick={handleLogout}>Log Out</button>
            </>
          )}
          <Link to="/list-property" className="navbar-list-property desktop-list-property">List Your Property</Link>
          <a href="/#contact" className="navbar-contact">Contact Us</a>
        </div>

        <button type="button" className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </header>
  )
}

export default Navbar
