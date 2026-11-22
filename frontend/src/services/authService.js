
const API_URL = 'http://localhost:4000/api'

const saveSession = (result) => {
  localStorage.setItem('oceanPyramidToken', result.token)
  localStorage.setItem('oceanPyramidUser', JSON.stringify(result.user))
}

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Something went wrong.')
  }

  return result
}

export const registerUser = async (userData) => {
  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

  saveSession(result)
  return result
}

export const loginUser = async (credentials) => {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  saveSession(result)
  return result
}

export const logoutUser = () => {
  localStorage.removeItem('oceanPyramidToken')
  localStorage.removeItem('oceanPyramidUser')
}

export const getStoredToken = () => {
  return localStorage.getItem('oceanPyramidToken')
}

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

  return token
    ? { Authorization: `Bearer ${token}` }
    : {}
}
