
const { Property, Enquiry, ViewingRequest } = require('../models')
const { sendNotificationEmail } = require('../services/emailService')

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])

const notifyBusiness = async (details) => {
  try {
    await sendNotificationEmail(details)
  } catch (error) {
    // The enquiry/viewing is already safely stored in MySQL. Email failure
    // must not make the visitor submit the same request again.
    console.error('Business email notification failed:', error.message)
  }
}

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const getApprovedProperty = async (propertyId) => {
  if (!/^\d+$/.test(String(propertyId))) {
    return null
  }

  return Property.findOne({
    where: {
      id: Number(propertyId),
      status: 'approved',
    },
  })
}

const createPropertyEnquiry = async (req, res, next) => {
  try {
    const property = await getApprovedProperty(req.params.propertyId)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or is no longer available.',
      })
    }

    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const phone = String(req.body.phone || '').trim()
    const message = String(req.body.message || '').trim()

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and message are required.',
      })
    }

    if (name.length > 150 || email.length > 191 || phone.length > 30) {
      return res.status(400).json({
        success: false,
        message: 'One or more fields exceed the allowed length.',
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    const enquiry = await Enquiry.create({
      propertyId: property.id,
      userId: req.user?.id || null,
      name,
      email,
      phone: phone || null,
      message,
    })

    const propertyUrl = `${process.env.CLIENT_URL || 'http://localhost:5174'}/properties/${property.slug}`
    await notifyBusiness({
      subject: `New property enquiry: ${property.title}`,
      text: `A new property enquiry was received.\n\nProperty: ${property.title}\nProperty URL: ${propertyUrl}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nMessage: ${message}\nEnquiry ID: ${enquiry.id}`,
      html: `<h2>New property enquiry</h2><p><strong>Property:</strong> ${escapeHtml(property.title)}</p><p><a href="${escapeHtml(propertyUrl)}">View property</a></p><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p><p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p><p>Enquiry ID: ${enquiry.id}</p>`,
    })

    return res.status(201).json({
      success: true,
      message: 'Your property enquiry has been submitted successfully.',
      enquiry: {
        id: enquiry.id,
        propertyId: enquiry.propertyId,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

const createViewingRequest = async (req, res, next) => {
  try {
    const property = await getApprovedProperty(req.params.propertyId)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or is no longer available.',
      })
    }

    const name = String(req.body.name || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const phone = String(req.body.phone || '').trim()
    const preferredDate = String(req.body.preferredDate || '').trim()
    const preferredTime = String(req.body.preferredTime || '').trim()
    const message = String(req.body.message || '').trim()

    if (!name || !email || !phone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone and preferred date are required.',
      })
    }

    if (
      name.length > 150 ||
      email.length > 191 ||
      phone.length > 30 ||
      preferredTime.length > 30
    ) {
      return res.status(400).json({
        success: false,
        message: 'One or more fields exceed the allowed length.',
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    const dateIsValid =
      /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) &&
      !Number.isNaN(Date.parse(`${preferredDate}T00:00:00.000Z`)) &&
      new Date(`${preferredDate}T00:00:00.000Z`).toISOString().slice(0, 10) === preferredDate

    if (!dateIsValid) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid viewing date.',
      })
    }

    const today = new Date().toISOString().slice(0, 10)

    if (preferredDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Viewing date cannot be in the past.',
      })
    }

    const viewingRequest = await ViewingRequest.create({
      propertyId: property.id,
      userId: req.user?.id || null,
      name,
      email,
      phone,
      preferredDate,
      preferredTime: preferredTime || null,
      message: message || null,
    })

    const propertyUrl = `${process.env.CLIENT_URL || 'http://localhost:5174'}/properties/${property.slug}`
    await notifyBusiness({
      subject: `New viewing request: ${property.title}`,
      text: `A new property viewing request was received.\n\nProperty: ${property.title}\nProperty URL: ${propertyUrl}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred date: ${preferredDate}\nPreferred time: ${preferredTime || 'Not specified'}\nMessage: ${message || 'No additional message'}\nRequest ID: ${viewingRequest.id}`,
      html: `<h2>New property viewing request</h2><p><strong>Property:</strong> ${escapeHtml(property.title)}</p><p><a href="${escapeHtml(propertyUrl)}">View property</a></p><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}</p><p><strong>Preferred time:</strong> ${escapeHtml(preferredTime || 'Not specified')}</p><p><strong>Message:</strong><br>${escapeHtml(message || 'No additional message').replace(/\n/g, '<br>')}</p><p>Request ID: ${viewingRequest.id}</p>`,
    })

    return res.status(201).json({
      success: true,
      message: 'Your viewing request has been submitted successfully.',
      viewingRequest: {
        id: viewingRequest.id,
        propertyId: viewingRequest.propertyId,
        preferredDate: viewingRequest.preferredDate,
        preferredTime: viewingRequest.preferredTime,
        status: viewingRequest.status,
        createdAt: viewingRequest.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createPropertyEnquiry,
  createViewingRequest,
}
