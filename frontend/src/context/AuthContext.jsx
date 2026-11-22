import { createContext, useContext, useEffect, useState } from 'react'
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredToken,
  getStoredUser,
  getCurrentUser,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(getStoredToken)
  const [authLoading, setAuthLoading] = useState(Boolean(getStoredToken()))

  useEffect(() => {
    let active = true
    const restoreSession = async () => {
      if (!token) {
        setAuthLoading(false)
        return
      }
      try {
        const result = await getCurrentUser()
        if (active) {
          setUser(result.user)
          localStorage.setItem('oceanPyramidUser', JSON.stringify(result.user))
        }
      } catch {
        if (active) {
          logoutUser()
          setUser(null)
          setToken(null)
        }
      } finally {
        if (active) setAuthLoading(false)
      }
    }
    restoreSession()
    return () => { active = false }
  }, [])

  const login = async (credentials) => {
    const result = await loginUser(credentials)
    setUser(result.user)
    setToken(result.token)
    return result
  }

  const register = async (userData) => {
    const result = await registerUser(userData)
    setUser(result.user)
    setToken(result.token)
    return result
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider.')
  return context
}
