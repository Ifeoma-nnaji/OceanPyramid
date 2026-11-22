import { apiRequest, getApiAssetUrl } from './apiClient'

export async function getProperties(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value)
  })
  const query = params.toString()
  const result = await apiRequest(`/properties${query ? `?${query}` : ''}`)
  return result.properties || []
}

export async function getPropertyBySlug(slug) {
  const result = await apiRequest(`/properties/${encodeURIComponent(slug)}`)
  return result.property
}

export const getPropertyImageUrl = getApiAssetUrl

export async function createProperty(propertyData) {
  const body = typeof FormData !== 'undefined' && propertyData instanceof FormData
    ? propertyData
    : JSON.stringify(propertyData)
  const result = await apiRequest('/properties', { method: 'POST', body })
  return result.property
}

export async function uploadPropertyImages(propertyId, files) {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))
  const result = await apiRequest(`/properties/${propertyId}/images`, {
    method: 'POST',
    body: formData,
  })
  return result.images
}

export async function getMyProperties() {
  const result = await apiRequest('/properties/mine')
  return result.properties || []
}

export async function submitPropertyEnquiry(propertyId, enquiry) {
  return apiRequest(`/properties/${propertyId}/enquiries`, {
    method: 'POST',
    body: JSON.stringify(enquiry),
  })
}

export async function requestPropertyViewing(propertyId, viewingRequest) {
  return apiRequest(`/properties/${propertyId}/viewing-requests`, {
    method: 'POST',
    body: JSON.stringify(viewingRequest),
  })
}
