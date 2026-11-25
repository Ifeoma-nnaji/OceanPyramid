import { apiRequest } from './apiClient'

export async function getAdminProperties(filters = {}) {
  const params = new URLSearchParams(filters)
  const result = await apiRequest(`/admin/properties${params.size ? `?${params}` : ''}`)
  return result.properties || []
}

export async function approveProperty(propertyId) {
  return apiRequest(`/admin/properties/${propertyId}/approve`, { method: 'PATCH' })
}

export async function rejectProperty(propertyId, reason) {
  return apiRequest(`/admin/properties/${propertyId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function archiveProperty(propertyId) {
  return apiRequest(`/admin/properties/${propertyId}/archive`, {
    method: 'PATCH',
  })
}

export async function getAdministrators() {
  const result = await apiRequest('/admin/administrators')
  return result.administrators || []
}

export async function createAdministrator(administrator) {
  return apiRequest('/admin/administrators', {
    method: 'POST',
    body: JSON.stringify(administrator),
  })
}

export async function updateAdministratorStatus(id, isActive) {
  return apiRequest(`/admin/administrators/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  })
}
