import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) return <div role="status" className="route-loading">Checking your session...</div>

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  const allowedRoles = ['super_admin', 'admin']

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminProtectedRoute
