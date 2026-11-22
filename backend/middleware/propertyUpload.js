
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const uploadDirectory = path.join(
  __dirname,
  '..',
  'uploads',
  'properties'
)

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true })
}

const allowedMimeTypes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory)
  },

  filename: (req, file, callback) => {
    const extension = allowedMimeTypes[file.mimetype]
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`

    callback(null, filename)
  },
})

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes[file.mimetype]) {
    return callback(
      new Error('Only JPEG, PNG and WebP images are allowed.')
    )
  }

  callback(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
})

// Confirm that the logged-in user owns the property before accepting images.
const ensurePropertyOwner = async (req, res, next) => {
  try {
    const { Property } = require('../models')

    const property = await Property.findOne({
      where: {
        id: req.params.propertyId,
        createdByUserId: req.user.id,
      },
    })

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found or you do not have permission to upload images.',
      })
    }

    req.property = property
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  upload,
  ensurePropertyOwner,
}
