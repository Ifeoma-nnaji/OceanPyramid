const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const readToken = () => {
  try {
    return localStorage.getItem('oceanPyramidToken')
  } catch {
    return null
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const { headers = {}, ...requestOptions } = options
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData
  const token = readToken()
  const requestHeaders = { ...headers }

  if (requestOptions.body !== undefined && !isFormData && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json'
  }
  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    ...requestOptions,
    headers: requestHeaders,
  })

  const contentType = response.headers?.get?.('content-type') || ''
  const result = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof result === 'object' && result?.message
      ? result.message
      : `Request failed with status ${response.status}.`
    const error = new Error(message)
    error.status = response.status
    error.payload = result
    throw error
  }

  return result
}

export const getApiBaseUrl = () => API_BASE_URL

export const getApiAssetUrl = (assetPath) => {
  if (!assetPath) return ''
  if (/^https?:\/\//i.test(assetPath)) return assetPath
  const apiUrl = new URL(API_BASE_URL, window.location.origin)
  const serverOrigin = API_BASE_URL.startsWith('http') ? apiUrl.origin : window.location.origin
  return `${serverOrigin}${assetPath.startsWith('/') ? assetPath : `/${assetPath}`}`
}
