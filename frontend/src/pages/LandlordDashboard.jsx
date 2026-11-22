
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMyProperties,
  getPropertyImageUrl,
} from '../services/propertyService'
import './LandlordDashboard.css'

function formatPrice(price, currency = 'NGN') {
  if (price === null || price === undefined || price === '') {
    return 'Price on request'
  }

  const amount = Number(price)

  if (Number.isNaN(amount)) {
    return `${currency} ${price}`
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPurpose(purpose) {
  const labels = {
    sale: 'For Sale',
    rent: 'For Rent',
    short_let: 'Short Let',
  }

  return labels[purpose] || purpose
}

function formatStatus(status) {
  const labels = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    draft: 'Draft',
    archived: 'Archived',
  }

  return labels[status] || status
}

function LandlordDashboard() {
  const { user, token, logout } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let isMounted = true

    const loadProperties = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getMyProperties(token)

        if (isMounted) {
          setProperties(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load your properties.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProperties()

    return () => {
      isMounted = false
    }
  }, [token])

  const counts = {
    all: properties.length,
    pending: properties.filter((property) => property.status === 'pending').length,
    approved: properties.filter((property) => property.status === 'approved').length,
    rejected: properties.filter((property) => property.status === 'rejected').length,
  }

  const filteredProperties =
    activeFilter === 'all'
      ? properties
      : properties.filter((property) => property.status === activeFilter)

  const firstName = user?.firstName || 'Landlord'

  return (
    <div className="landlord-dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-mark">OP</span>
          <span>
            <strong>OCEAN PYRAMIDS</strong>
            <small>PROPERTY MANAGEMENT</small>
          </span>
        </Link>

        <div className="dashboard-sidebar-label">MENU</div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-nav-link active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/dashboard" className="dashboard-nav-link">
            <span>⌂</span>
            My Properties
          </Link>

          <Link to="/list-property" className="dashboard-nav-link">
            <span>＋</span>
            Add Property
          </Link>

          <Link to="/" className="dashboard-nav-link">
            <span>↗</span>
            Visit Website
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{firstName} {user?.lastName || ''}</strong>
              <small>{user?.role || 'Landlord'}</small>
            </div>
          </div>

          <button
            type="button"
            className="dashboard-logout"
            onClick={logout}
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-eyebrow">PROPERTY MANAGEMENT</span>
            <h1>My Dashboard</h1>
          </div>

          <Link to="/list-property" className="dashboard-add-button">
            + List a Property
          </Link>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span>WELCOME BACK</span>
            <h2>Hello, {firstName}.</h2>
            <p>
              Manage your property listings and keep track of their approval status.
            </p>
          </div>
          <div className="dashboard-welcome-decoration">OP</div>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span>Total Properties</span>
            <strong>{counts.all}</strong>
            <small>All your submitted listings</small>
          </div>

          <div className="dashboard-stat-card pending-stat">
            <span>Pending Review</span>
            <strong>{counts.pending}</strong>
            <small>Awaiting admin approval</small>
          </div>

          <div className="dashboard-stat-card approved-stat">
            <span>Approved</span>
            <strong>{counts.approved}</strong>
            <small>Visible to customers</small>
          </div>

          <div className="dashboard-stat-card rejected-stat">
            <span>Rejected</span>
            <strong>{counts.rejected}</strong>
            <small>Requires your attention</small>
          </div>
        </section>

        <section className="dashboard-listings">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">YOUR PORTFOLIO</span>
              <h2>My Properties</h2>
              <p>View and manage the properties you have submitted.</p>
            </div>

            <Link to="/list-property" className="dashboard-secondary-button">
              + Add New Property
            </Link>
          </div>

          <div className="dashboard-filters">
            {[
              { value: 'all', label: 'All Properties' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={activeFilter === filter.value ? 'active' : ''}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
                <span>{counts[filter.value]}</span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="dashboard-message">
              Loading your properties...
            </div>
          )}

          {!loading && error && (
            <div className="dashboard-message dashboard-error">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredProperties.length === 0 && (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">⌂</div>
              <h3>
                {properties.length === 0
                  ? 'You have not listed any properties yet.'
                  : 'No properties in this category.'}
              </h3>
              <p>
                {properties.length === 0
                  ? 'Start by submitting your first property listing.'
                  : 'Try selecting another status filter.'}
              </p>

              {properties.length === 0 && (
                <Link to="/list-property" className="dashboard-add-button">
                  List Your First Property
                </Link>
              )}
            </div>
          )}

          {!loading && !error && filteredProperties.length > 0 && (
            <div className="dashboard-property-list">
              {filteredProperties.map((property) => {
                const primaryImage =
                  property.images?.find((image) => image.isPrimary) ||
                  property.images?.[0]

                return (
                  <article
                    className="dashboard-property-card"
                    key={property.id}
                  >
                    <div className="dashboard-property-image">
                      {primaryImage?.imageUrl ? (
                        <img
                          src={getPropertyImageUrl(primaryImage.imageUrl)}
                          alt={primaryImage.altText || property.title}
                        />
                      ) : (
                        <div className="dashboard-no-image">
                          No property image
                        </div>
                      )}
                    </div>

                    <div className="dashboard-property-info">
                      <div className="dashboard-property-topline">
                        <span className="dashboard-property-category">
                          {property.category || 'Property'}
                        </span>

                        <span
                          className={`dashboard-status status-${property.status}`}
                        >
                          {formatStatus(property.status)}
                        </span>
                      </div>

                      <h3>{property.title}</h3>

                      <p className="dashboard-property-location">
                        {[
                          property.neighborhood,
                          property.city,
                          property.state,
                        ].filter(Boolean).join(', ') || property.address}
                      </p>

                      <div className="dashboard-property-details">
                        {property.bedrooms > 0 && (
                          <span>{property.bedrooms} Bedrooms</span>
                        )}
                        {property.bathrooms > 0 && (
                          <span>{property.bathrooms} Bathrooms</span>
                        )}
                        {property.area && (
                          <span>{property.area} {property.areaUnit || ''}</span>
                        )}
                      </div>

                      <div className="dashboard-property-bottom">
                        <strong>
                          {formatPrice(property.price, property.currency)}
                        </strong>
                        <span>{formatPurpose(property.purpose)}</span>
                      </div>

                      {property.status === 'rejected' && property.rejectionReason && (
                        <p className="dashboard-rejection-reason">
                          Admin feedback: {property.rejectionReason}
                        </p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default LandlordDashboard
