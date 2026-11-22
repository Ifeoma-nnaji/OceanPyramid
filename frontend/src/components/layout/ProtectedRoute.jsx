import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, allowedRoles = ['landlord', 'agent', 'developer'] }) {
  const { isAuthenticated, user, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) return <div role="status" className="route-loading">Checking your session...</div>

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'customer' ? '/my-account' : '/'} replace />
  }

  return children
}

export default ProtectedRoute
