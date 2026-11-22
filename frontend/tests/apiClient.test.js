import test from 'node:test'
import assert from 'node:assert/strict'
import { apiRequest, getApiAssetUrl } from '../src/services/apiClient.js'

const originalFetch = globalThis.fetch
const originalLocalStorage = globalThis.localStorage
const originalWindow = globalThis.window

function response(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => 'application/json' },
    json: async () => body,
    text: async () => JSON.stringify(body),
  }
}

test.afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalLocalStorage === undefined) delete globalThis.localStorage
  else globalThis.localStorage = originalLocalStorage
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
})

test('apiRequest sends JSON headers and bearer token when a session exists', async () => {
  const calls = []
  globalThis.localStorage = { getItem: (key) => key === 'oceanPyramidToken' ? 'test-token' : null }
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return response({ success: true })
  }

  const result = await apiRequest('/auth/me')
  assert.deepEqual(result, { success: true })
  assert.equal(calls[0].url, '/api/auth/me')
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-token')
})

test('apiRequest reports server error messages and status codes', async () => {
  globalThis.localStorage = { getItem: () => null }
  globalThis.fetch = async () => response({ success: false, message: 'Access denied.' }, 403)
  await assert.rejects(apiRequest('/admin'), (error) => {
    assert.equal(error.message, 'Access denied.')
    assert.equal(error.status, 403)
    return true
  })
})

test('apiRequest does not force JSON content type for FormData', async () => {
  const formData = new FormData()
  formData.append('images', new Blob(['image']), 'photo.jpg')
  let sentOptions
  globalThis.localStorage = { getItem: () => null }
  globalThis.fetch = async (_url, options) => {
    sentOptions = options
    return response({ success: true })
  }
  await apiRequest('/properties/1/images', { method: 'POST', body: formData })
  assert.equal(sentOptions.headers['Content-Type'], undefined)
})

test('getApiAssetUrl preserves absolute URLs and resolves relative upload paths', () => {
  globalThis.window = { location: { origin: 'http://localhost:5173' } }
  assert.equal(getApiAssetUrl('https://cdn.example.com/home.jpg'), 'https://cdn.example.com/home.jpg')
  assert.equal(getApiAssetUrl('/uploads/home.jpg'), 'http://localhost:5173/uploads/home.jpg')
})
