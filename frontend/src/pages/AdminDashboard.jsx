
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPropertyImageUrl } from '../services/propertyService'
import './AdminDashboard.css'

const API_URL = 'http://localhost:4000/api'

const filters = [
  { value: 'all', label: 'All Properties' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
]

const statusLabels = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  draft: 'Draft',
  archived: 'Archived',
}

function formatPrice(price, currency = 'NGN') {
  if (price === null || price === undefined || price === '') {
    return 'Price on request'
  }

  const amount = Number(price)

  if (Number.isNaN(amount)) return `${currency} ${price}`

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function AdminDashboard() {
  const { user, token, logout } = useAuth()

  const [properties, setProperties] = useState([])
  const [activeFilter, setActiveFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/admin/properties?limit=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load properties.')
      }

      setProperties(result.properties || [])
    } catch (err) {
      setError(err.message || 'Unable to load properties.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const counts = {
    all: properties.length,
    pending: properties.filter((item) => item.status === 'pending').length,
    approved: properties.filter((item) => item.status === 'approved').length,
    rejected: properties.filter((item) => item.status === 'rejected').length,
    archived: properties.filter((item) => item.status === 'archived').length,
  }

  const visibleProperties =
    activeFilter === 'all'
      ? properties
      : properties.filter((item) => item.status === activeFilter)

  const handleApprove = async (propertyId) => {
    const confirmed = window.confirm(
      'Approve this property and publish it on the website?'
    )

    if (!confirmed) return

    try {
      setActionLoading(propertyId)
      setActionMessage('')

      const response = await fetch(
        `${API_URL}/admin/properties/${propertyId}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to approve property.')
      }

      setActionMessage(result.message || 'Property approved successfully.')
      setSelectedProperty(null)
      await loadProperties()
    } catch (err) {
      setActionMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (propertyId) => {
    if (!rejectionReason.trim()) {
      setActionMessage('Please enter a reason for rejecting this property.')
      return
    }

    try {
      setActionLoading(propertyId)
      setActionMessage('')

      const response = await fetch(
        `${API_URL}/admin/properties/${propertyId}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: rejectionReason.trim(),
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to reject property.')
      }

      setActionMessage(result.message || 'Property rejected.')
      setSelectedProperty(null)
      setRejectionReason('')
      await loadProperties()
    } catch (err) {
      setActionMessage(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const firstName = user?.firstName || 'Admin'

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="admin-brand-mark">OP</span>
          <span>
            <strong>OCEAN PYRAMIDS</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <span className="admin-sidebar-label">MANAGEMENT</span>

        <nav className="admin-navigation">
  <a href="#overview" className="admin-nav-link active">
    <span>▦</span> Overview
  </a>

  <a href="#properties" className="admin-nav-link">
    <span>⌂</span> Properties
  </a>

  <a href="#properties" className="admin-nav-link">
    <span>◷</span> Approvals
  </a>

  {user?.role === 'super_admin' && (
    <Link to="/admin/administrators" className="admin-nav-link">
      <span>♙</span> Administrators
    </Link>
  )}

  <Link to="/" className="admin-nav-link">
    <span>↗</span> Visit Website
  </Link>
</nav>


        <div className="admin-sidebar-bottom">
          <div className="admin-user">
            <div className="admin-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{firstName} {user?.lastName || ''}</strong>
              <small>Administrator</small>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout"
            onClick={logout}
          >
            Log Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar" id="overview">
          <div>
            <span className="admin-eyebrow">OCEAN PYRAMIDS MANAGEMENT</span>
            <h1>Admin Dashboard</h1>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadProperties}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <span>ADMINISTRATION PANEL</span>
            <h2>Welcome back, {firstName}.</h2>
            <p>
              Review property submissions and manage listings across Ocean
              Pyramid Properties.
            </p>
          </div>
          <div className="admin-welcome-mark">OP</div>
        </section>

        <section className="admin-stat-grid">
          <article className="admin-stat-card">
            <span>Total Properties</span>
            <strong>{counts.all}</strong>
            <small>All submitted listings</small>
          </article>

          <article className="admin-stat-card admin-pending-card">
            <span>Awaiting Approval</span>
            <strong>{counts.pending}</strong>
            <small>Require admin review</small>
          </article>

          <article className="admin-stat-card admin-approved-card">
            <span>Approved</span>
            <strong>{counts.approved}</strong>
            <small>Published listings</small>
          </article>

          <article className="admin-stat-card admin-rejected-card">
            <span>Rejected</span>
            <strong>{counts.rejected}</strong>
            <small>Rejected submissions</small>
          </article>
        </section>

        <section className="admin-properties-section" id="properties">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">LISTING MANAGEMENT</span>
              <h2>Property Submissions</h2>
              <p>Review and manage properties submitted by landlords and agents.</p>
            </div>
          </div>

          <div className="admin-filter-bar">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                className={activeFilter === filter.value ? 'active' : ''}
                onClick={() => {
                  setActiveFilter(filter.value)
                  setSelectedProperty(null)
                  setActionMessage('')
                }}
              >
                {filter.label}
                <span>{counts[filter.value]}</span>
              </button>
            ))}
          </div>

          {actionMessage && (
            <div className="admin-action-message">
              {actionMessage}
            </div>
          )}

          {loading && (
            <div className="admin-empty-state">
              Loading property submissions...
            </div>
          )}

          {!loading && error && (
            <div className="admin-empty-state admin-error">
              <p>{error}</p>
              <button type="button" onClick={loadProperties}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && visibleProperties.length === 0 && (
            <div className="admin-empty-state">
              <span>⌂</span>
              <h3>No properties found</h3>
              <p>There are no properties in this category at the moment.</p>
            </div>
          )}

          {!loading && !error && visibleProperties.length > 0 && (
            <div className="admin-property-list">
              {visibleProperties.map((property) => {
                const primaryImage =
                  property.images?.find((image) => image.isPrimary) ||
                  property.images?.[0]

                return (
                  <article className="admin-property-card" key={property.id}>
                    <div className="admin-property-image">
                      {primaryImage?.imageUrl ? (
                        <img
                          src={getPropertyImageUrl(primaryImage.imageUrl)}
                          alt={primaryImage.altText || property.title}
                        />
                      ) : (
                        <span>No image uploaded</span>
                      )}
                    </div>

                    <div className="admin-property-info">
                      <div className="admin-property-topline">
                        <span>{property.category || 'Property'}</span>
                        <span className={`admin-status status-${property.status}`}>
                          {statusLabels[property.status] || property.status}
                        </span>
                      </div>

                      <h3>{property.title}</h3>

                      <p className="admin-property-location">
                        {[
                          property.neighborhood,
                          property.city,
                          property.state,
                        ].filter(Boolean).join(', ') || property.address}
                      </p>

                      <div className="admin-property-meta">
                        <strong>
                          {formatPrice(property.price, property.currency)}
                        </strong>
                        <span>
                          {property.purpose?.replace('_', ' ')}
                        </span>
                        <span>
                          {property.images?.length || 0} photo(s)
                        </span>
                      </div>

                      <div className="admin-property-actions">
                        <button
                          type="button"
                          className="admin-view-button"
                          onClick={() => {
                            setSelectedProperty(property)
                            setRejectionReason('')
                            setActionMessage('')
                          }}
                        >
                          Review Details
                        </button>

                        {property.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              className="admin-approve-button"
                              disabled={actionLoading === property.id}
                              onClick={() => handleApprove(property.id)}
                            >
                              {actionLoading === property.id
                                ? 'Processing...'
                                : 'Approve'}
                            </button>

                            <button
                              type="button"
                              className="admin-reject-button"
                              onClick={() => {
                                setSelectedProperty(property)
                                setRejectionReason('')
                                setActionMessage('')
                              }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {selectedProperty && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedProperty(null)}
        >
          <section
            className="admin-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-review-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">PROPERTY REVIEW</span>
                <h2 id="admin-review-title">{selectedProperty.title}</h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedProperty(null)}
                aria-label="Close property review"
              >
                ×
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="admin-modal-gallery">
                {selectedProperty.images?.length > 0 ? (
                  selectedProperty.images.map((image) => (
                    <img
                      key={image.id}
                      src={getPropertyImageUrl(image.imageUrl)}
                      alt={image.altText || selectedProperty.title}
                    />
                  ))
                ) : (
                  <div className="admin-modal-no-image">
                    No property photographs available.
                  </div>
                )}
              </div>

              <div className="admin-modal-details">
                <div>
                  <span>Price</span>
                  <strong>
                    {formatPrice(
                      selectedProperty.price,
                      selectedProperty.currency
                    )}
                  </strong>
                </div>

                <div>
                  <span>Purpose</span>
                  <strong>{selectedProperty.purpose?.replace('_', ' ')}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{selectedProperty.category || 'Not specified'}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {[
                      selectedProperty.address,
                      selectedProperty.neighborhood,
                      selectedProperty.city,
                      selectedProperty.state,
                    ].filter(Boolean).join(', ') || 'Not specified'}
                  </strong>
                </div>

                <div>
                  <span>Bedrooms</span>
                  <strong>{selectedProperty.bedrooms ?? 'Not specified'}</strong>
                </div>

                <div>
                  <span>Bathrooms</span>
                  <strong>{selectedProperty.bathrooms ?? 'Not specified'}</strong>
                </div>
              </div>

              <div className="admin-modal-description">
                <h3>Property Description</h3>
                <p>
                  {selectedProperty.description || 'No description provided.'}
                </p>
              </div>

              {selectedProperty.status === 'pending' && (
                <div className="admin-rejection-form">
                  <label htmlFor="rejectionReason">
                    Rejection reason (required only if rejecting)
                  </label>

                  <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Explain what needs to be corrected..."
                    rows={3}
                  />
                </div>
              )}

              <div className="admin-modal-actions">
                {selectedProperty.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="admin-approve-button"
                      disabled={actionLoading === selectedProperty.id}
                      onClick={() => handleApprove(selectedProperty.id)}
                    >
                      {actionLoading === selectedProperty.id
                        ? 'Processing...'
                        : 'Approve & Publish'}
                    </button>

                    <button
                      type="button"
                      className="admin-reject-button"
                      disabled={actionLoading === selectedProperty.id}
                      onClick={() => handleReject(selectedProperty.id)}
                    >
                      Reject Property
                    </button>
                  </>
                )}

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() => setSelectedProperty(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

