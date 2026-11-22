const request = require('supertest')

jest.mock('../models', () => ({
  Property: { findOne: jest.fn() },
  Enquiry: { create: jest.fn() },
  ViewingRequest: { create: jest.fn() },
}))
jest.mock('../services/emailService', () => ({ sendNotificationEmail: jest.fn().mockResolvedValue({ sent: false }) }))

const app = require('../app')
const { Property, Enquiry, ViewingRequest } = require('../models')

describe('Property interaction API', () => {
  beforeEach(() => {
    Property.findOne.mockResolvedValue({ id: 15, title: 'Test home', slug: 'test-home' })
    Enquiry.create.mockResolvedValue({ id: 101, propertyId: 15, status: 'new', createdAt: new Date('2026-01-01T00:00:00Z') })
    ViewingRequest.create.mockResolvedValue({ id: 202, propertyId: 15, preferredDate: '2099-05-20', preferredTime: '10:00', status: 'requested', createdAt: new Date('2026-01-01T00:00:00Z') })
  })

  test('submits a valid property enquiry', async () => {
    const response = await request(app).post('/api/properties/15/enquiries').send({
      name: 'Test Customer', email: 'customer@example.com', phone: '08000000000', message: 'Please contact me.',
    })
    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(Enquiry.create).toHaveBeenCalledWith(expect.objectContaining({
      propertyId: 15,
      name: 'Test Customer',
      email: 'customer@example.com',
    }))
  })

  test('rejects an enquiry with a malformed email address', async () => {
    const response = await request(app).post('/api/properties/15/enquiries').send({
      name: 'Test Customer', email: 'not-an-email', message: 'Please contact me.',
    })
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/valid email/i)
    expect(Enquiry.create).not.toHaveBeenCalled()
  })

  test('submits a valid property viewing request', async () => {
    const response = await request(app).post('/api/properties/15/viewing-requests').send({
      name: 'Test Customer', email: 'customer@example.com', phone: '08000000000',
      preferredDate: '2099-05-20', preferredTime: '10:00',
    })
    expect(response.status).toBe(201)
    expect(response.body.success).toBe(true)
    expect(ViewingRequest.create).toHaveBeenCalledWith(expect.objectContaining({
      propertyId: 15,
      preferredDate: '2099-05-20',
    }))
  })
})
