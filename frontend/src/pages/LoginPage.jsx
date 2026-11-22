import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

function getDashboardPath(role) {
  if (['super_admin', 'admin'].includes(role)) return '/admin/dashboard'
  if (role === 'customer') return '/my-account'
  if (['landlord', 'agent', 'developer'].includes(role)) return '/dashboard'
  return null
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(form)
      const rolePath = getDashboardPath(result.user.role)
      if (!rolePath) {
        setError('Your account role does not currently have access to a web dashboard. Please contact Ocean Pyramid Properties.')
        return
      }

      const requestedPath = location.state?.from?.pathname
      const safeRequestedPath = requestedPath &&
        requestedPath !== '/login' &&
        requestedPath !== '/register' &&
        (rolePath === '/admin/dashboard'
          ? requestedPath.startsWith('/admin/')
          : rolePath === '/my-account'
            ? requestedPath === '/my-account'
            : ['/dashboard', '/list-property'].includes(requestedPath))
        ? requestedPath
        : rolePath

      navigate(safeRequestedPath, { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <span className="auth-eyebrow">OCEAN PYRAMID PROPERTIES</span>
        <h1>Welcome <em>back.</em></h1>
        <p className="auth-description">Sign in to access your Ocean Pyramid account.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email address
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email" required />
          </label>

          <label>Password
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password}
                onChange={handleChange} placeholder="Enter your password" autoComplete="current-password"
                required style={{ width: '100%', paddingRight: '48px', boxSizing: 'border-box' }} />
              <button type="button" onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px',
                  background: 'transparent', border: 'none', color: '#526a72', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={19} strokeWidth={1.8} /> : <Eye size={19} strokeWidth={1.8} />}
              </button>
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Create an account</Link></p>
        <Link to="/" className="auth-home-link">Back to homepage</Link>
      </div>
    </main>
  )
}

export default LoginPage
