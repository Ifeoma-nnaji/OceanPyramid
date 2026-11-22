
import { createContext, useContext, useState } from 'react'
import {
  loginUser,
  registerUser,
  logoutUser,
  getStoredToken,
  getStoredUser,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [token, setToken] = useState(getStoredToken)

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
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
