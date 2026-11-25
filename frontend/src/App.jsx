
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, BedDouble, Bath, ArrowRight,
  Building2, House, KeyRound, Trees, BriefcaseBusiness,
  Phone, Menu, X, ShieldCheck, ChevronDown,
  MessageCircle, MessageSquare, Send
} from 'lucide-react'
import './App.css'
import { useAuth } from './context/AuthContext'

import heroImage from './assets/ocean-hero.jpeg'
import logo from './assets/ocean-pyramid-logo.jpeg'

const categories = [
  {
    name: 'Apartments',
    description: 'Modern apartments for every lifestyle',
    icon: Building2,
    link: '/buy',
  },
  {
    name: 'Houses',
    description: 'Find your ideal family home',
    icon: House,
    link: '/buy',
  },
  {
    name: 'Land',
    description: 'Explore land and investment opportunities',
    icon: Trees,
    link: '/land',
  },
  {
    name: 'Commercial',
    description: 'Spaces for business and enterprise',
    icon: BriefcaseBusiness,
    link: '/commercial',
  },
]

const properties = [
  {
    name: 'Contemporary Guzape Residence',
    location: 'Guzape, Abuja',
    type: 'Residential Property',
    price: 'Price on request',
    beds: '4',
    baths: '4',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85',
    tag: 'For Sale',
    link: '/buy',
  },
  {
    name: 'Luxury Modern Apartment',
    location: 'Lagos, Nigeria',
    type: 'Apartment',
    price: 'Price on request',
    beds: '3',
    baths: '3',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85',
    tag: 'For Rent',
    link: '/rent',
  },
  {
    name: 'Executive Short-Let Residence',
    location: 'Lagos, Nigeria',
    type: 'Short Let',
    price: 'Price on request',
    beds: '2',
    baths: '2',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=900&q=85',
    tag: 'Short Let',
    link: '/short-let',
  },
]

const navigation = [
  { label: 'Sale', path: '/buy' },
  { label: 'Rent', path: '/rent' },
  { label: 'Short Let', path: '/short-let' },
  { label: 'Services', path: '/property-management', children: [
    { label: 'Property Management', path: '/property-management' },
    { label: 'Request a Property', path: '/request-property' },
    { label: 'Real Estate Advisory', path: '/advisory' },
    { label: 'Commercial Services', path: '/commercial-services' },
  ] },
  { label: 'Buy From Abroad', path: '/buy-from-abroad', children: [
    { label: 'Mortgage', path: '/mortgage' },
  ] },
  { label: 'Agents', path: '/agents' },
]

function getAccountDestination(role) {
  if (['super_admin', 'admin'].includes(role)) return '/admin/dashboard'
  if (role === 'customer') return '/my-account'
  return '/dashboard'
}

function App() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setMobileOpen(false)
    navigate('/')
  }

  const accountDestination = getAccountDestination(user?.role)
  const accountLabel = user?.role === 'customer'
    ? 'My Account'
    : ['super_admin', 'admin'].includes(user?.role)
      ? 'Admin Dashboard'
      : 'My Dashboard'

  const [activeTab, setActiveTab] = useState('Buy')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')

  const whatsappNumber = '2348033401596'
  const whatsappGreeting = 'Hello Ocean Pyramid Properties, I would like to make an enquiry.'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`

  const handleChatSubmit = (event) => {
    event.preventDefault()
    const message = chatMessage.trim() || whatsappGreeting
    const chatUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(chatUrl, '_blank', 'noopener,noreferrer')
    setChatMessage('')
    setChatOpen(false)
  }

  const handleSearch = (event) => {
    event.preventDefault()

    const routes = {
      Buy: '/buy',
      Rent: '/rent',
      'Short Let': '/short-let',
    }

    const params = new URLSearchParams()

    if (location.trim()) {
      params.set('location', location.trim())
    }

    if (category) {
      params.set('category', category)
    }

    const query = params.toString()

    navigate(`${routes[activeTab]}${query ? `?${query}` : ''}`)
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <img src={logo} alt="Ocean Pyramids" />
          </Link>

          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

          <nav className={mobileOpen ? 'nav-links open' : 'nav-links'}>
            {navigation.map((item) => (
              <div className="nav-dropdown" key={item.label}>
                <Link to={item.path} onClick={() => setMobileOpen(false)}>{item.label}{item.children ? <ChevronDown size={13} /> : null}</Link>
                {item.children && <div className="nav-dropdown-menu">
                  {item.children.map((child) => <Link key={child.path} to={child.path} onClick={() => setMobileOpen(false)}>{child.label}</Link>)}
                </div>}
              </div>
            ))}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="nav-account nav-account-login"
                  onClick={() => setMobileOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="nav-account nav-account-register"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={accountDestination}
                  onClick={() => setMobileOpen(false)}
                  style={{ color: '#ffffff', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  {accountLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-account nav-account-login nav-logout"
                >
                  Log Out
                </button>
              </>
            )}

            <Link
              className="nav-cta nav-list-property"
              to="/list-property"
              onClick={() => setMobileOpen(false)}
            >
              List Your Property <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <img
            className="hero-image"
            src={heroImage}
            alt="A family enjoying a luxury home at Ocean Pyramids"
            style={{
              objectFit: 'cover',
              objectPosition: '58% center',
            }}
          />
          <div className="hero-overlay" />

          <div className="container hero-content">
            <span className="eyebrow hero-eyebrow">
              OCEAN PYRAMIDS PROPERTIES
            </span>

            <h1>
              Home is<br />
              <em>here.</em>
            </h1>

            <p>
              Discover exceptional properties across Lagos and beyond. Whether you are buying,
              renting or investing, our team helps you make confident property decisions.
            </p>

            <Link to="/contact" className="hero-link">
              Speak to an Advisor <ArrowRight size={17} />
            </Link>
          </div>

          <div className="container search-container">
            <div className="property-search">
              <div className="search-tabs">
                {['Buy', 'Rent', 'Short Let'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={activeTab === tab ? 'search-tab active' : 'search-tab'}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form className="search-fields" onSubmit={handleSearch}>
                <label className="search-field">
                  <span>LOCATION</span>
                  <div>
                    <MapPin size={17} />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="City, neighbourhood or area"
                    />
                  </div>
                </label>

                <label className="search-field">
                  <span>PROPERTY TYPE</span>
                  <div>
                    <House size={17} />
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    >
                      <option value="">All property types</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="land">Land</option>
                      <option value="commercial">Commercial</option>
                      <option value="office">Office</option>
                      <option value="warehouse">Warehouse</option>
                    </select>
                    <ChevronDown size={15} />
                  </div>
                </label>

                <button className="search-button" type="submit">
                  <Search size={18} /> Search properties
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="partner-strip">
          <div className="container partner-strip-inner">
            <span>PROPERTY GUIDANCE</span><span>LOCAL MARKET KNOWLEDGE</span><span>PERSONAL ADVISORY</span><span>SUPPORT FROM SEARCH TO COMPLETION</span>
          </div>
        </section>

        <section className="budget-section section-pad">
          <div className="container">
            <span className="eyebrow">A PLACE FOR EVERY AMBITION</span>
            <div className="section-heading"><div><h2>Explore properties by <em>budget.</em></h2><p>Start with a price range that works for you.</p></div></div>
            <div className="budget-grid">
              {[
                { price: 'Up to ₦120M', desc: 'Explore accessible opportunities', href: '/buy?minPrice=0&maxPrice=120000000', style: 'budget-card--available' },
                { price: '₦120M – ₦250M', desc: 'More premium properties coming soon', href: '/buy?minPrice=120000001&maxPrice=250000000', style: 'budget-card--empty' },
                { price: '₦250M+', desc: 'Exceptional luxury properties', href: '/buy?minPrice=250000001', style: 'budget-card--available' },
              ].map(({ price, desc, href, style }) => (
                <Link to={href} className={`budget-card ${style}`} key={price}>
                  <strong>{price}</strong>
                  <span>{desc}</span>
                  <ArrowRight size={18}/>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="intro-section section-pad">
          <div className="container intro-grid">
            <div>
              <span className="eyebrow">WELCOME TO OCEAN PYRAMIDS</span>
              <h2>
                Property decisions<br />
                made with <em>confidence.</em>
              </h2>
            </div>

            <div className="intro-copy">
              <p>
                Whether you are searching for a new home, looking to invest
                in land or seeking the right commercial space, we help you
                navigate the property market with clarity and confidence.
              </p>

              <Link to="/about" className="text-link">
                Discover Ocean Pyramids <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="category-section section-pad">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">EXPLORE OUR PORTFOLIO</span>
                <h2>Find the right <em>property.</em></h2>
              </div>

              <Link to="/buy" className="text-link">
                View all properties <ArrowRight size={16} />
              </Link>
            </div>

            <div className="category-grid">
              {categories.map(({ name, description, icon: Icon, link }) => (
                <Link to={link} className="category-card" key={name}>
                  <span className="category-icon">
                    <Icon size={25} strokeWidth={1.5} />
                  </span>
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <span className="category-arrow">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="properties-section section-pad" id="properties">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SELECTED OPPORTUNITIES</span>
                <h2>Featured <em>properties.</em></h2>
              </div>

              <Link to="/buy" className="text-link">
                Explore properties <ArrowRight size={16} />
              </Link>
            </div>

            <div className="property-grid">
              {properties.map((property) => (
                <article className="property-card" key={property.name}>
                  <Link to={property.link}>
                    <div className="property-image-wrap">
                      <img src={property.image} alt={property.name} />
                      <span className="property-tag">{property.tag}</span>
                    </div>
                  </Link>

                  <div className="property-info">
                    <span className="property-type">{property.type}</span>
                    <h3>{property.name}</h3>

                    <p className="property-location">
                      <MapPin size={15} /> {property.location}
                    </p>

                    <div className="property-meta">
                      <span><BedDouble size={16} /> {property.beds} Beds</span>
                      <span><Bath size={16} /> {property.baths} Baths</span>
                    </div>

                    <div className="property-bottom">
                      <strong>{property.price}</strong>
                      <Link to={property.link} aria-label={`Explore ${property.name}`}>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <p className="demo-note">
              Property photographs and details shown here are presentation
              placeholders. Verified listings will replace them before publication.
            </p>
          </div>
        </section>

        <section className="locations-section section-pad">
          <div className="container">
            <span className="eyebrow">DISCOVER THE NEIGHBOURHOOD</span>
            <div className="section-heading"><div><h2>Explore prime <em>locations.</em></h2><p>Discover property opportunities in sought-after neighbourhoods.</p></div></div>
            <div className="location-grid">
              {[['Lekki','Lagos'],['Victoria Island','Lagos'],['Ikoyi','Lagos'],['Ikeja GRA','Lagos']].map(([name,state],i)=><Link to={'/buy?location='+encodeURIComponent(name)} className={'location-card location-card-'+i} key={name}><span>{state}</span><strong>{name}</strong><em>Explore collection <ArrowRight size={15}/></em></Link>)}
            </div>
          </div>
        </section>

        <section className="land-section section-pad" id="land">
          <div className="container land-grid">
            <div className="land-copy">
              <span className="eyebrow">LAND & INVESTMENT</span>
              <h2>
                Build your future<br />
                on the <em>right ground.</em>
              </h2>

              <p>
                Explore land opportunities and property investments
                in carefully selected locations.
              </p>

              <Link to="/land" className="light-button">
                Explore land opportunities <ArrowRight size={16} />
              </Link>
            </div>

            <div className="land-image">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1100&q=85"
                alt="Open land and landscape"
              />
            </div>
          </div>
        </section>

        <section className="commercial-section section-pad" id="commercial">
          <div className="container commercial-grid">
            <div>
              <span className="eyebrow">COMMERCIAL REAL ESTATE</span>
              <h2>
                Space for your<br />
                <em>next big move.</em>
              </h2>
            </div>

            <div>
              <p>
                From offices and retail spaces to warehouses and mixed-use
                developments, discover spaces that support business growth.
              </p>

              <Link to="/commercial" className="text-link">
                Explore commercial properties <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="trust-section section-pad" id="about">
          <div className="container trust-grid">
            <div>
              <ShieldCheck size={30} />
              <h3>Guided property decisions</h3>
              <p>Support throughout your property search and enquiry.</p>
            </div>

            <div>
              <Building2 size={30} />
              <h3>Residential & commercial</h3>
              <p>Explore opportunities across different property categories.</p>
            </div>

            <div>
              <KeyRound size={30} />
              <h3>Sales, rentals & short lets</h3>
              <p>One destination for different property needs.</p>
            </div>
          </div>
        </section>

        <section className="advisory-section section-pad">
          <div className="container advisory-inner">
            <div>
              <span className="eyebrow">PRIVATE PROPERTY ADVISORY</span>
              <h2>Not seeing the right <em>property?</em></h2>
              <p>Tell us what you are looking for. Our team can help source suitable homes, land and investment opportunities.</p>
            </div>
            <Link to="/contact" className="dark-button">Speak to an Advisor <ArrowRight size={17} /></Link>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="container contact-grid">
            <div>
              <span className="eyebrow">LET'S TALK PROPERTY</span>
              <h2>
                Start your next<br />
                <em>property journey.</em>
              </h2>
            </div>

            <div className="contact-copy">
              <p>
                Tell us what you are looking for. Our team can help you
                take the next step.
              </p>

              <a href="/contact" className="text-link">
                <Phone size={16} /> Contact our team
              </a>

              <p className="contact-note">
                Add your verified business telephone number and email
                address before publishing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <div>
            <img src={logo} alt="Ocean Pyramids" />
            <p>Property opportunities. Informed decisions.</p>
          </div>

          <div className="footer-links">
            <Link to="/buy">Buy</Link>
            <Link to="/rent">Rent</Link>
            <Link to="/short-let">Short Let</Link>
            <Link to="/land">Land</Link>
            <Link to="/commercial">Commercial</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Ocean Pyramid Properties. All rights reserved.</span>
          <span>Built around your property ambitions.</span>
        </div>
      </footer>

      <div className="floating-contact" aria-label="Contact Ocean Pyramid Properties">
        {chatOpen && (
          <section className="quick-chat-panel" aria-label="Chat with Ocean Pyramid Properties">
            <div className="quick-chat-header">
              <div className="quick-chat-avatar"><MessageCircle size={20} /></div>
              <div className="quick-chat-heading">
                <strong>Ocean Pyramid Properties</strong>
                <span><i /> Continue the conversation on WhatsApp</span>
              </div>
              <button type="button" className="quick-chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
                <X size={19} />
              </button>
            </div>
            <div className="quick-chat-body">
              <div className="quick-chat-message">
                Hello! Welcome to Ocean Pyramid Properties. How can we help with your property search today?
              </div>
              <span className="quick-chat-hint">Send your message and we'll continue the conversation on WhatsApp.</span>
            </div>
            <form className="quick-chat-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="Type your message..."
                aria-label="Your message"
              />
              <button type="submit" aria-label="Send message"><Send size={18} /></button>
            </form>
          </section>
        )}

        <a className="floating-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Contact Ocean Pyramid Properties on WhatsApp" title="WhatsApp us">
          <MessageCircle size={25} /><span>WhatsApp</span>
        </a>

        <button
          type="button"
          className={`floating-chat-toggle${chatOpen ? ' is-open' : ''}`}
          onClick={() => setChatOpen((open) => !open)}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? 'Close chat' : 'Open chat'}
        >
          {chatOpen ? <X size={24} /> : <MessageSquare size={25} />}
          <span>{chatOpen ? 'Close' : 'Chat with us'}</span>
        </button>
      </div>
    </div>
  )
}

export default App
