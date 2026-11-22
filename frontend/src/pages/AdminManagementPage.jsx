
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:4000/api'

function AdminManagementPage() {
  const { user, token } = useAuth()

  const [administrators, setAdministrators] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
  })

  const loadAdministrators = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/admin/administrators`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load administrators.')
      }

      setAdministrators(result.administrators || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadAdministrators()
    }
  }, [user, loadAdministrators])

  if (user?.role !== 'super_admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/admin/administrators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to create account.')
      }

      setMessage(result.message || 'Account created successfully.')

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'admin',
      })

      setShowPassword(false)

      await loadAdministrators()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (administrator) => {
    const nextStatus = !administrator.isActive

    const confirmed = window.confirm(
      `${nextStatus ? 'Activate' : 'Deactivate'} the account for ${administrator.firstName} ${administrator.lastName}?`
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/admin/administrators/${administrator.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: nextStatus }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to update account status.')
      }

      setMessage(result.message || 'Account status updated.')
      await loadAdministrators()
    } catch (err) {
      setError(err.message)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #d8e1e3',
    borderRadius: '8px',
    fontSize: '14px',
    marginTop: '7px',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    color: '#36515b',
    fontSize: '13px',
    fontWeight: 600,
  }

  const visibilityButtonStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
    background: 'transparent',
    border: 'none',
    color: '#526a72',
    cursor: 'pointer',
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F8F6F0',
      padding: '35px 5%',
      color: '#123B50',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
        marginBottom: '30px',
      }}>
        <div>
          <span style={{
            color: '#2F9EAA',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1.5px',
          }}>
            SUPER ADMINISTRATION
          </span>

          <h1 style={{ margin: '8px 0', fontSize: '30px' }}>
            Administrator Management
          </h1>

          <p style={{ color: '#63777d', margin: 0 }}>
            Create and manage your administrative team.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          style={{
            background: '#123B50',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '14px',
          }}
        >
          Back to Dashboard
        </Link>
      </header>

      <section style={{
        background: '#fff',
        padding: '25px',
        borderRadius: '14px',
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(18,59,80,0.05)',
      }}>
        <h2 style={{ marginTop: 0 }}>Create an Administrator</h2>

        <p style={{ color: '#63777d', fontSize: '14px' }}>
          Create an Admin or Staff account.
        </p>

        <form onSubmit={handleCreate}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginTop: '22px',
          }}>
            <label style={labelStyle}>
              First name
              <input
                style={inputStyle}
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label style={labelStyle}>
              Last name
              <input
                style={inputStyle}
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </label>

            <label style={labelStyle}>
              Email address
              <input
                style={inputStyle}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label style={labelStyle}>
              Phone number
              <input
                style={inputStyle}
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label style={labelStyle}>
              Temporary password

              <div style={{ position: 'relative' }}>
                <input
                  style={{
                    ...inputStyle,
                    paddingRight: '48px',
                  }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={visibilityButtonStyle}
                >
                  {showPassword ? (
                    <EyeOff size={19} strokeWidth={1.8} />
                  ) : (
                    <Eye size={19} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </label>

            <label style={labelStyle}>
              Account role
              <select
                style={inputStyle}
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: '22px',
              background: '#2F9EAA',
              color: '#fff',
              border: 0,
              borderRadius: '8px',
              padding: '13px 22px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {saving ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </section>

      {message && (
        <p style={{
          background: '#e6f5ef',
          color: '#176b4b',
          padding: '13px 16px',
          borderRadius: '8px',
        }}>
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          style={{
            background: '#fff0ed',
            color: '#a73525',
            padding: '13px 16px',
            borderRadius: '8px',
          }}
        >
          {error}
        </p>
      )}

      <section style={{
        background: '#fff',
        padding: '25px',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(18,59,80,0.05)',
      }}>
        <h2>Administrative Team</h2>
        <p>{administrators.length} account(s)</p>

        {loading && <p>Loading administrator accounts...</p>}

        {!loading && !error && administrators.length === 0 && (
          <p>No Admin or Staff accounts have been created yet.</p>
        )}

        {!loading && administrators.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '650px',
            }}>
              <thead>
                <tr style={{ background: '#f3f7f7', textAlign: 'left' }}>
                  <th style={{ padding: '14px' }}>Name</th>
                  <th style={{ padding: '14px' }}>Email</th>
                  <th style={{ padding: '14px' }}>Role</th>
                  <th style={{ padding: '14px' }}>Status</th>
                  <th style={{ padding: '14px' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {administrators.map((administrator) => (
                  <tr key={administrator.id}>
                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #edf0f0',
                    }}>
                      {administrator.firstName} {administrator.lastName}
                    </td>

                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #edf0f0',
                    }}>
                      {administrator.email}
                    </td>

                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #edf0f0',
                    }}>
                      {administrator.role.toUpperCase()}
                    </td>

                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #edf0f0',
                    }}>
                      {administrator.isActive ? 'Active' : 'Inactive'}
                    </td>

                    <td style={{
                      padding: '15px',
                      borderBottom: '1px solid #edf0f0',
                    }}>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(administrator)}
                      >
                        {administrator.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminManagementPage
