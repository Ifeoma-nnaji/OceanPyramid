import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Building2, Compass } from 'lucide-react'
import './StaticPage.css'

function AboutPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-inner">
          <span className="static-eyebrow">About Ocean Pyramid Properties</span>
          <h1>Property decisions made with confidence.</h1>
          <p>We help people explore residential, land and commercial property opportunities across Lagos and other locations in Nigeria.</p>
        </div>
      </section>
      <section className="static-content">
        <div className="static-columns">
          <div>
            <h2>A considered approach to property.</h2>
            <p>Finding or investing in property is an important decision. Ocean Pyramid Properties is being built around clear property information, helpful guidance and a straightforward way to connect buyers, renters, landlords and agents.</p>
            <p>Our platform brings property discovery and enquiries together, with room to grow into a wider marketplace for verified property owners and professional agents.</p>
            <div className="static-actions"><Link className="static-button" to="/buy">Explore properties <ArrowRight size={16} /></Link><Link className="static-button secondary" to="/contact">Contact our team</Link></div>
          </div>
          <div className="static-panel">
            <h3>What we focus on</h3>
            <ul className="static-list">
              <li><ShieldCheck size={18} /> Clear property information and guided enquiries</li>
              <li><Building2 size={18} /> Residential, land and commercial opportunities</li>
              <li><Compass size={18} /> Property discovery across locations that matter</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
export default AboutPage
