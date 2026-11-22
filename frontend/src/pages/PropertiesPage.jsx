import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  MapPin, BedDouble, Bath, Search, ArrowLeft, SlidersHorizontal,
  ArrowUpDown, Home, X, Maximize, ChevronRight
} from 'lucide-react'
import { getProperties, getPropertyImageUrl } from '../services/propertyService'
import './PropertiesPage.css'

// Genuine editorial/stock photographs from Unsplash. These are page banners only,
// never photographs of Ocean Pyramid properties or individual property listings.
const pageTypes = {
  buy: {
    title: 'Properties for Sale',
    purpose: 'sale',
    intro: 'Discover homes and investment opportunities selected for your next move.',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'FIND YOUR NEXT HOME',
  },
  rent: {
    title: 'Properties for Rent',
    purpose: 'rent',
    intro: 'Explore residential and commercial spaces available to rent.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'A PLACE TO CALL HOME',
  },
  'short-let': {
    title: 'Short-Let Properties',
    purpose: 'short_let',
    intro: 'Find comfortable short-stay accommodation for work, travel and leisure.',
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'STAY A LITTLE DIFFERENT',
  },
  land: {
    title: 'Land Opportunities',
    category: 'land',
    intro: 'Explore land opportunities for development and long-term investment.',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'ROOM TO BUILD',
  },
  commercial: {
    title: 'Commercial Properties',
    category: 'commercial',
    intro: 'Find offices, retail spaces, warehouses and business premises.',
    heroImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85',
    eyebrow: 'SPACE FOR BUSINESS',
  },
}

const formatPrice = (price, currency = 'NGN') => {
  const amount = Number(price)
  if (!Number.isFinite(amount)) return 'Price on request'
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString('en-NG')}`
  }
}

function PropertiesPage({ type = 'buy' }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = pageTypes[type] || pageTypes.buy
  const [properties, setProperties] = useState([])
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let active = true
    async function loadProperties() {
      setLoading(true)
      setError('')
      try {
        const filters = {
          ...(page.purpose ? { purpose: page.purpose } : {}),
          ...(page.category ? { category: page.category } : {}),
          ...(location.trim() ? { location: location.trim() } : {}),
        }
        const data = await getProperties(filters)
        if (active) setProperties(data)
      } catch (err) {
        if (active) setError(err.message || 'Unable to load properties.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProperties()
    return () => { active = false }
  }, [type])

  const filteredProperties = useMemo(() => {
    const normal = (value) => String(value || '').toLowerCase()
    let result = properties.filter((property) => {
      const matchesLocation = !location.trim() || [
        property.neighborhood, property.city, property.state, property.address
      ].some((value) => normal(value).includes(normal(location.trim())))
      const matchesCategory = !category || normal(property.category) === normal(category)
      const matchesBedrooms = !bedrooms || Number(property.bedrooms || 0) >= Number(bedrooms)
      const price = Number(property.price)
      const matchesMin = !minPrice || (Number.isFinite(price) && price >= Number(minPrice))
      const matchesMax = !maxPrice || (Number.isFinite(price) && price <= Number(maxPrice))
      return matchesLocation && matchesCategory && matchesBedrooms && matchesMin && matchesMax
    })
    if (sort === 'price-low') result.sort((a, b) => Number(a.price) - Number(b.price))
    if (sort === 'price-high') result.sort((a, b) => Number(b.price) - Number(a.price))
    if (sort === 'beds') result.sort((a, b) => Number(b.bedrooms || 0) - Number(a.bedrooms || 0))
    return result
  }, [properties, location, category, bedrooms, minPrice, maxPrice, sort])

  const applyFilters = (event) => {
    event?.preventDefault()
    const next = {}
    if (location.trim()) next.location = location.trim()
    if (category) next.category = category
    if (bedrooms) next.bedrooms = bedrooms
    if (minPrice) next.minPrice = minPrice
    if (maxPrice) next.maxPrice = maxPrice
    if (sort !== 'newest') next.sort = sort
    setSearchParams(next)
  }

  const clearFilters = () => {
    setLocation('')
    setCategory('')
    setBedrooms('')
    setMinPrice('')
    setMaxPrice('')
    setSort('newest')
    setSearchParams({})
  }

  const hasFilters = Boolean(location || category || bedrooms || minPrice || maxPrice || sort !== 'newest')

  return (
    <main className="listing-page">
      <header className="listing-header" style={{ '--listing-hero-image': `url("${page.heroImage}")` }}>
        <div className="listing-header-inner">
          <nav className="listing-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} />
            <span>{page.title}</span>
          </nav>
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>
      </header>

      <section className="listing-content">
        <form className="marketplace-search" onSubmit={applyFilters}>
          <div className="marketplace-search-top">
            <label className="marketplace-location"><MapPin size={18}/><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter city, neighbourhood or area"/></label>
            <button className="marketplace-filter-toggle" type="button" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16}/>{showFilters ? 'Hide filters' : 'More filters'}</button>
            <button className="marketplace-submit" type="submit"><Search size={17}/> Search properties</button>
          </div>
          {showFilters && <div className="marketplace-advanced">
            <label>Property type<select value={category} onChange={e => setCategory(e.target.value)}><option value="">All property types</option><option value="apartment">Apartment</option><option value="house">House</option><option value="land">Land</option><option value="commercial">Commercial</option><option value="office">Office</option><option value="warehouse">Warehouse</option><option value="duplex">Duplex</option></select></label>
            <label>Bedrooms<select value={bedrooms} onChange={e => setBedrooms(e.target.value)}><option value="">Any bedrooms</option><option value="1">1+ bedrooms</option><option value="2">2+ bedrooms</option><option value="3">3+ bedrooms</option><option value="4">4+ bedrooms</option><option value="5">5+ bedrooms</option></select></label>
            <label>Minimum price<input type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="No minimum"/></label>
            <label>Maximum price<input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="No maximum"/></label>
          </div>}
        </form>

        <div className="marketplace-results-bar">
          <div><span className="marketplace-kicker">PROPERTY COLLECTION</span><h2>Explore available properties</h2><p>{loading ? 'Finding matching properties…' : `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`}</p></div>
          <label className="marketplace-sort"><ArrowUpDown size={15}/><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="beds">Most bedrooms</option></select></label>
        </div>

        {hasFilters && <div className="marketplace-active-filters"><span>Filters applied</span><button type="button" onClick={clearFilters}>Clear all <X size={13}/></button></div>}
        {loading && <p className="listing-message">Loading properties...</p>}
        {!loading && error && <div className="listing-empty listing-error"><h3>We couldn't load the listings.</h3><p>{error} Please check that the Ocean Pyramid API is running and try again.</p><button className="marketplace-submit" onClick={() => window.location.reload()}>Try again</button></div>}
        {!loading && !error && filteredProperties.length === 0 && <div className="listing-empty"><div className="listing-empty-icon"><Home size={28}/></div><h3>{properties.length ? 'No properties match these filters.' : 'New property opportunities coming soon.'}</h3><p>{properties.length ? 'Try changing your location, price range or property filters.' : 'Our property collection is being updated. Speak with our team and tell us what you are looking for.'}</p><div className="listing-empty-actions">{hasFilters && <button type="button" onClick={clearFilters}>Clear filters</button>}<Link to="/contact" className="listing-contact">Speak to an advisor</Link></div></div>}

        {!loading && !error && filteredProperties.length > 0 && <div className="listing-grid">
          {filteredProperties.map(property => {
            const image = property.images?.find(item => item.isPrimary) || property.images?.[0]
            const place = [property.neighborhood, property.city, property.state].filter(Boolean).join(', ')
            return <Link to={`/properties/${property.slug}`} className="listing-card" key={property.id}>
              <div className="listing-card-image">{image?.imageUrl ? <img src={getPropertyImageUrl(image.imageUrl)} alt={image.altText || property.title}/> : <div className="listing-image-placeholder"><Home size={32}/><span>Photographs coming soon</span></div>}<span className="listing-property-tag">{property.purpose?.replace('_', ' ') || page.title}</span></div>
              <div className="listing-card-body"><span className="listing-category">{property.category || 'Property'}</span><h3>{property.title}</h3><p className="listing-location"><MapPin size={14}/>{place || 'Nigeria'}</p>
                <div className="listing-card-meta">{property.bedrooms > 0 && <span><BedDouble size={15}/>{property.bedrooms} beds</span>}{property.bathrooms > 0 && <span><Bath size={15}/>{property.bathrooms} baths</span>}{property.area && <span><Maximize size={14}/>{property.area} {property.areaUnit || ''}</span>}</div>
                <div className="listing-card-price">{formatPrice(property.price, property.currency)}<span>View property <ArrowLeft size={14}/></span></div>
              </div>
            </Link>
          })}
        </div>}
      </section>
    </main>
  )
}

export default PropertiesPage
