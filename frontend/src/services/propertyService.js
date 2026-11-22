
const API_URL = 'http://localhost:4000/api'

export async function getProperties(filters = {}) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  })

  const query = params.toString()

  const response = await fetch(
    `${API_URL}/properties${query ? `?${query}` : ''}`
  )

  if (!response.ok) {
    throw new Error('Unable to load properties.')
  }

  const result = await response.json()
  return result.properties || []
}

export async function getPropertyBySlug(slug) {
  const response = await fetch(
    `${API_URL}/properties/${encodeURIComponent(slug)}`
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load this property.')
  }

  return result.property
}

export function getPropertyImageUrl(imageUrl) {
  if (!imageUrl) return ''

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  return `${API_URL.replace('/api', '')}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

export async function createProperty(propertyData, token) {
  const response = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(propertyData),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to submit property.')
  }

  return result.property
}

export async function uploadPropertyImages(propertyId, files, token) {
  const formData = new FormData()

  files.forEach((file) => {
    formData.append('images', file)
  })

  const response = await fetch(
    `${API_URL}/properties/${propertyId}/images`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to upload property images.')
  }

  return result.images
}

// GET THE LOGGED-IN LANDLORD OR AGENT'S PROPERTIES
export async function getMyProperties(token) {
  const response = await fetch(`${API_URL}/properties/mine`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Unable to load your properties.')
  }

  return result.properties || []
}
