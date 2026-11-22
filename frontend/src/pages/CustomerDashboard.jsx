import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './CustomerDashboard.css'

function CustomerDashboard() {
  const { user, logout } = useAuth()
  const firstName = user?.firstName || 'there'

  return (
    <main className="customer-account">
      <header className="customer-account-header">
        <Link to="/" className="customer-account-brand">OCEAN PYRAMID <span>PROPERTIES</span></Link>
        <nav>
          <Link to="/buy">Explore properties</Link>
          <Link to="/rent">Find a rental</Link>
          <button type="button" onClick={logout}>Log out</button>
        </nav>
      </header>
      <section className="customer-account-content">
        <span className="customer-account-eyebrow">YOUR OCEAN PYRAMID ACCOUNT</span>
        <h1>Welcome, {firstName}.</h1>
        <p>Your account is ready. Explore available properties or speak with our team for help finding the right home or investment.</p>
        <div className="customer-account-actions">
          <Link to="/buy">Explore properties for sale</Link>
          <Link to="/rent">Browse rental properties</Link>
          <Link to="/contact">Speak to an advisor</Link>
        </div>
        <div className="customer-account-profile">
          <h2>Account details</h2>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Account type:</strong> Buyer / Property seeker</p>
        </div>
      </section>
    </main>
  )
}

export default CustomerDashboard
