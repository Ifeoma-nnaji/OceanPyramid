
const express = require('express')
const router = express.Router()

const {
  createProperty,
  getProperties,
  getPropertyBySlug,
  getMyProperties,
  addPropertyImages,
} = require('../controllers/propertyController')

const {
  createPropertyEnquiry,
  createViewingRequest,
} = require('../controllers/propertyInteractionController')

const { protect } = require('../middleware/authMiddleware')

const {
  upload,
  ensurePropertyOwner,
} = require('../middleware/propertyUpload')

const { createPropertyValidator } = require('../validators/propertyValidator')
const validate = require('../validators/validationMiddleware')

// Public property routes
router.get('/', getProperties)

// Authenticated user's properties
router.get('/mine', protect, getMyProperties)

// Create a property
router.post(
  '/',
  protect,
  createPropertyValidator,
  validate,
  createProperty
)

// Upload property images
router.post(
  '/:propertyId/images',
  protect,
  ensurePropertyOwner,
  upload.array('images', 10),
  addPropertyImages
)

// Public property enquiries
router.post(
  '/:propertyId/enquiries',
  createPropertyEnquiry
)


router.post(
  '/:propertyId/viewing-requests',
  createViewingRequest
)


router.get('/:slug', getPropertyBySlug)

module.exports = router
