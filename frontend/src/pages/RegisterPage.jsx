import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const destinationForRole = (role) => {
    if (['super_admin', 'admin'].includes(role)) return '/admin/dashboard'
    if (role === 'customer') return '/my-account'
    return '/dashboard'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      const result = await register(form)
      navigate(destinationForRole(result.user.role), { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  const passwordFieldStyle = { width: '100%', paddingRight: '48px', boxSizing: 'border-box' }
  const visibilityButtonStyle = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px',
    background: 'transparent', border: 'none', color: '#526a72', cursor: 'pointer',
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide">
        <span className="auth-eyebrow">OCEAN PYRAMID PROPERTIES</span>
        <h1>Create your <em>account.</em></h1>
        <p className="auth-description">
          Create an account to discover properties or manage your property business.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-two-columns">
            <label>First name
              <input name="firstName" value={form.firstName} onChange={handleChange} autoComplete="given-name" required />
            </label>
            <label>Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} autoComplete="family-name" required />
            </label>
          </div>

          <label>Email address
            <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required />
          </label>

          <label>Phone number
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} autoComplete="tel" />
          </label>

          <label>What best describes your account?
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="customer">Buyer / Property seeker</option>
              <option value="agent">Real estate agent</option>
              <option value="landlord">Property owner / Landlord</option>
              <option value="developer">Property developer</option>
            </select>
          </label>

          <label>Password
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} minLength={8} autoComplete="new-password" required style={passwordFieldStyle} />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'} style={visibilityButtonStyle}>
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          <label>Confirm password
            <div style={{ position: 'relative' }}>
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password"
                required style={passwordFieldStyle} />
              <button type="button" onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} style={visibilityButtonStyle}>
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        <Link to="/" className="auth-home-link">Back to homepage</Link>
        <p className="auth-description" style={{ fontSize: '12px', marginTop: '16px' }}>
          Administrator accounts are created securely by an authorised administrator. They cannot be registered here.
        </p>
      </div>
    </main>
  )
}

export default RegisterPage
