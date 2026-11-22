import { Link } from 'react-router-dom'
import { ArrowRight, Users, UserPlus } from 'lucide-react'
import './StaticPage.css'

function AgentsPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-inner">
          <span className="static-eyebrow">Our property network</span>
          <h1>Connect with property professionals.</h1>
          <p>Ocean Pyramid is building a network of landlords and property agents to make discovering and enquiring about property opportunities easier.</p>
        </div>
      </section>
      <section className="static-content">
        <div className="static-columns">
          <div>
            <h2>Agent directory</h2>
            <p>Agent profiles will appear here as approved agents join the platform. We won't display invented agent names or unverified contact details.</p>
            <div className="static-actions"><Link className="static-button" to="/register">Join as an agent <ArrowRight size={16} /></Link><Link className="static-button secondary" to="/contact">Speak to our team</Link></div>
          </div>
          <div className="static-panel">
            <Users size={30} color="#2f9eaa" />
            <h3>For property professionals</h3>
            <p>Create an account to begin the registration process. Agent listings and public profiles can be enabled after the relevant account has been reviewed and approved.</p>
            <p><UserPlus size={17} /> Public registration is available through the platform.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
export default AgentsPage
