import { useState } from 'react'
import { Search, MapPin, Home } from 'lucide-react'
import heroImage from '../../assets/hero.png'
import './Hero.css'

function Hero() {
  const [listingType, setListingType] = useState('sale')
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation] = useState('')

  const listingTabs = [
    { label: 'Buy', value: 'sale' },
    { label: 'Rent', value: 'rent' },
    { label: 'Short Let', value: 'short_let' },
  ]

  const handleSearch = (event) => {
    event.preventDefault()

    const searchParams = new URLSearchParams({
      purpose: listingType,
      category: propertyType,
      location,
    })

    window.location.href = `/properties?${searchParams.toString()}`
  }

  return (
    <section className="hero-section" id="home">
      <div className="hero-background">
        <img
          src={heroImage}
          alt="Property featured by Ocean Pyramids"
          className="hero-image"
        />
        <div className="hero-overlay" />
      </div>

      <div className="hero-content">
        <span className="hero-eyebrow">
          YOUR PROPERTY JOURNEY STARTS HERE
        </span>

        <h1>
          Find a Place
          <br />
          <span>to Call Home.</span>
        </h1>

        <p>
          Discover exceptional homes, land and investment opportunities
          with Ocean Pyramids.
        </p>

        <div className="hero-search-wrapper" id="property-search">
          <div className="hero-search-tabs">
            {listingTabs.map((tab) => (
              <button
                type="button"
                key={tab.value}
                className={listingType === tab.value ? 'active' : ''}
                onClick={() => setListingType(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form className="hero-search-form" onSubmit={handleSearch}>
            <label className="hero-search-field">
              <span>
                <MapPin size={17} />
                Location
              </span>

              <input
                type="text"
                placeholder="Enter a city or area"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>

            <label className="hero-search-field property-type-field">
              <span>
                <Home size={17} />
                Property Type
              </span>

              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
              >
                <option value="">All Property Types</option>
                <option value="house">Houses</option>
                <option value="apartment">Flats & Apartments</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial Properties</option>
                <option value="carcass">Uncompleted / Carcass Properties</option>
              </select>
            </label>

            <button type="submit" className="hero-search-button">
              <Search size={19} />
              <span>Search Properties</span>
            </button>
          </form>
        </div>
      </div>

      <div className="hero-bottom-label">
        <span>PROPERTY. INVESTMENT. OPPORTUNITY.</span>
      </div>
    </section>
  )
}

export default Hero