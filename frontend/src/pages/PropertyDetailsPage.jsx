
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  MapPin, BedDouble, Bath, Maximize, ArrowLeft,
  CheckCircle, Phone, Home
} from 'lucide-react'

import {
  getPropertyBySlug,
  getPropertyImageUrl
} from '../services/propertyService'

import './PropertyDetailsPage.css'

function PropertyDetailsPage() {
  const { slug } = useParams()

  const [property, setProperty] = useState(null)
  const [activeImage, setActiveImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadProperty() {
      setLoading(true)
      setError('')

      try {
        const data = await getPropertyBySlug(slug)

        if (active) {
          setProperty(data)

          const images = data.images || []
          const primary = images.find((image) => image.isPrimary) || images[0]

          setActiveImage(
            primary ? getPropertyImageUrl(primary.imageUrl) : ''
          )
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProperty()

    return () => {
      active = false
    }
  }, [slug])

  const formatPrice = (price, currency) => {
    const amount = Number(price)

    if (!Number.isFinite(amount)) return 'Price on request'

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return <main className="property-detail-state">Loading property details...</main>
  }

  if (error || !property) {
    return (
      <main className="property-detail-state">
        <h2>Property unavailable</h2>
        <p>{error || 'This property could not be found.'}</p>
        <Link to="/buy" className="detail-back">
          <ArrowLeft size={16} /> Browse properties
        </Link>
      </main>
    )
  }

  const images = property.images || []
  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : []

  const location = [
    property.neighborhood,
    property.city,
    property.state,
    property.country,
  ].filter(Boolean).join(', ')

  return (
    <main className="property-detail-page">
      <div className="property-detail-container">

        <Link to="/buy" className="detail-back">
          <ArrowLeft size={16} /> Back to properties
        </Link>

        <div className="detail-heading">
          <div>
            <span className="detail-eyebrow">
              {property.purpose?.replace('_', ' ')}
            </span>
            <h1>{property.title}</h1>
            <p><MapPin size={17} /> {location}</p>
          </div>

          <div className="detail-price">
            <span>Property price</span>
            <strong>
              {formatPrice(property.price, property.currency)}
            </strong>
            {property.priceNegotiable && <small>Price negotiable</small>}
          </div>
        </div>

        <section className="detail-gallery">
          <div className="detail-main-image">
            {activeImage ? (
              <img src={activeImage} alt={property.title} />
            ) : (
              <div className="detail-no-image">
                <Home size={45} />
                <span>Property photographs coming soon</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((image) => {
                const imageUrl = getPropertyImageUrl(image.imageUrl)

                return (
                  <button
                    type="button"
                    key={image.id}
                    className={activeImage === imageUrl ? 'selected' : ''}
                    onClick={() => setActiveImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={image.altText || property.title}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <div className="detail-content-grid">
          <div className="detail-main-content">

            <section className="detail-features">
              {property.bedrooms !== null && property.bedrooms !== undefined && (
                <div><BedDouble /><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>
              )}

              {property.bathrooms !== null && property.bathrooms !== undefined && (
                <div><Bath /><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>
              )}

              {property.area && (
                <div><Maximize /><strong>{property.area}</strong><span>{property.areaUnit || 'Area'}</span></div>
              )}

              <div><Home /><strong>{property.category}</strong><span>Property type</span></div>
            </section>

            <section className="detail-section">
              <span className="detail-eyebrow">PROPERTY DESCRIPTION</span>
              <h2>About this property</h2>
              <p className="detail-description">{property.description}</p>
            </section>

            {amenities.length > 0 && (
              <section className="detail-section">
                <span className="detail-eyebrow">PROPERTY FEATURES</span>
                <h2>Features & amenities</h2>

                <div className="amenities-grid">
                  {amenities.map((amenity, index) => (
                    <div key={`${amenity}-${index}`}>
                      <CheckCircle size={17} />
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="detail-section">
              <span className="detail-eyebrow">PROPERTY LOCATION</span>
              <h2>Location details</h2>
              <p className="detail-description">
                {property.address}, {location}
              </p>
            </section>
          </div>

          <aside className="detail-contact-card">
            <span className="detail-eyebrow">INTERESTED IN THIS PROPERTY?</span>
            <h3>Make your next property move.</h3>
            <p>
              Contact Ocean Pyramids to enquire about this property
              or arrange a viewing.
            </p>
            <a href="/contact" className="detail-enquiry-button">
              <Phone size={17} /> Enquire about this property
            </a>
            <small>Reference: {property.slug}</small>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PropertyDetailsPage
