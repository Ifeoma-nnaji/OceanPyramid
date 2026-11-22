import { apiRequest } from './apiClient'

const saveSession = (result) => {
  localStorage.setItem('oceanPyramidToken', result.token)
  localStorage.setItem('oceanPyramidUser', JSON.stringify(result.user))
}

export const registerUser = async (userData) => {
  const result = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  saveSession(result)
  return result
}

export const loginUser = async (credentials) => {
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  saveSession(result)
  return result
}

export const getCurrentUser = () => apiRequest('/auth/me')

export const logoutUser = () => {
  localStorage.removeItem('oceanPyramidToken')
  localStorage.removeItem('oceanPyramidUser')
}

export const getStoredToken = () => localStorage.getItem('oceanPyramidToken')

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('oceanPyramidUser')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const getAuthHeaders = () => {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
