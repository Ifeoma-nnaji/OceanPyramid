const request = require('supertest')
const app = require('../app')

describe('API health and routing', () => {
  test('GET /api/health reports that the API is running', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      success: true,
      message: 'Ocean Pyramids API is running.',
      environment: 'test',
    })
  })

  test('unknown routes return a consistent JSON 404', async () => {
    const response = await request(app).get('/api/does-not-exist')
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ success: false, message: 'Route not found.' })
  })
})
