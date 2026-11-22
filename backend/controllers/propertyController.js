
const { Op } = require('sequelize')

const slugify = (value) =>
  value.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const {
  sequelize,
  Property,
  PropertyImage,
  AgentProfile,
} = require('../models')

// CREATE PROPERTY
const createProperty = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const {
      title,
      description,
      purpose,
      category,
      price,
      currency,
      priceNegotiable,
      bedrooms,
      bathrooms,
      toilets,
      area,
      areaUnit,
      landSize,
      landSizeUnit,
      address,
      neighborhood,
      city,
      state,
      country,
      furnished,
      amenities,
    } = req.body

    const slug = `${slugify(title)}-${Date.now()}`

    const agentProfile = req.user.role === 'agent'
      ? await AgentProfile.findOne({
          where: { userId: req.user.id },
          transaction,
        })
      : null

    const property = await Property.create({
      createdByUserId: req.user.id,
      agentProfileId: agentProfile ? agentProfile.id : null,
      title,
      slug,
      description,
      purpose,
      category,
      price,
      currency: currency || 'NGN',
      priceNegotiable: priceNegotiable === true || priceNegotiable === 'true',
      bedrooms,
      bathrooms,
      toilets,
      area,
      areaUnit,
      landSize,
      landSizeUnit,
      address,
      neighborhood,
      city,
      state,
      country: country || 'Nigeria',
      furnished,
      amenities: typeof amenities === 'string'
        ? JSON.parse(amenities || '[]')
        : amenities,
      status: 'pending',
    }, { transaction })

    await transaction.commit()

    return res.status(201).json({
      success: true,
      message: 'Property submitted for admin approval.',
      property,
    })
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    next(error)
  }
}

// UPLOAD PROPERTY IMAGES
const addPropertyImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one image to upload.',
      })
    }

    const existingImageCount = await PropertyImage.count({
      where: { propertyId: req.property.id },
    })

    if (existingImageCount + req.files.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'A property can have a maximum of 10 images.',
      })
    }

    const images = await PropertyImage.bulkCreate(
      req.files.map((file, index) => ({
        propertyId: req.property.id,
        imageUrl: `/uploads/properties/${file.filename}`,
        altText: `${req.property.title} - Property image ${existingImageCount + index + 1}`,
        isPrimary: existingImageCount === 0 && index === 0,
        displayOrder: existingImageCount + index,
      })),
      { returning: true }
    )

    return res.status(201).json({
      success: true,
      message: 'Property images uploaded successfully.',
      images,
    })
  } catch (error) {
    next(error)
  }
}

// GET APPROVED PROPERTIES
const getProperties = async (req, res, next) => {
  try {
    const {
      purpose,
      category,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      page = 1,
      limit = 12,
    } = req.query

    const currentPage = Math.max(parseInt(page, 10) || 1, 1)
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50)

    const where = { status: 'approved' }

    if (purpose && ['sale', 'rent', 'short_let'].includes(purpose)) {
      where.purpose = purpose
    }

    if (category) where.category = category

    if (location) {
      where[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { state: { [Op.like]: `%${location}%` } },
        { neighborhood: { [Op.like]: `%${location}%` } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}

      if (minPrice) where.price[Op.gte] = Number(minPrice)
      if (maxPrice) where.price[Op.lte] = Number(maxPrice)
    }

    if (bedrooms) where.bedrooms = Number(bedrooms)

    const result = await Property.findAndCountAll({
      where,
      include: [{
        model: PropertyImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
      }],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      distinct: true,
    })

    return res.status(200).json({
      success: true,
      total: result.count,
      page: currentPage,
      pages: Math.ceil(result.count / pageSize),
      properties: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

// GET ONE APPROVED PROPERTY
const getPropertyBySlug = async (req, res, next) => {
  try {
    const property = await Property.findOne({
      where: {
        slug: req.params.slug,
        status: 'approved',
      },
      include: [{
        model: PropertyImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
      }],
    })

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      })
    }

    return res.status(200).json({
      success: true,
      property,
    })
  } catch (error) {
    next(error)
  }
}

// GET THE LOGGED-IN USER'S PROPERTIES
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.findAll({
      where: { createdByUserId: req.user.id },
      include: [{ model: PropertyImage, as: 'images' }],
      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      success: true,
      properties,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createProperty,
  addPropertyImages,
  getProperties,
  getPropertyBySlug,
  getMyProperties,
}
