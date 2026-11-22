require('dotenv').config()

const { sequelize, User, Property, PropertyImage } = require('../models')

async function addOlogoloShortlet() {
  await sequelize.authenticate()

  const admin = await User.findByPk(7)
  if (!admin) {
    throw new Error('Super Admin user ID 7 was not found. No property was created.')
  }

  const slug = '4-bedroom-shortlet-ologolo-lekki'
  const existing = await Property.findOne({ where: { slug } })

  if (existing) {
    console.log(`Property already exists (ID: ${existing.id}). No duplicate was created.`)
    return
  }

  const transaction = await sequelize.transaction()

  try {
    const property = await Property.create({
      createdByUserId: admin.id,
      approvedByUserId: admin.id,
      title: '4-Bedroom Short-Let in Ologolo, Lekki',
      slug,
      description: 'Four-bedroom short-let accommodation in Ologolo, Lekki, Lagos. The supplied photographs show the bedrooms and dining area. Rate: ₦50,000 per night. Contact Ocean Pyramid Properties for availability, booking details and further information.',
      purpose: 'short_let',
      category: 'shortlet',
      price: 50000,
      currency: 'NGN',
      priceNegotiable: false,
      bedrooms: 4,
      address: 'Ologolo, Lekki',
      neighborhood: 'Ologolo',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      status: 'approved',
      approvedAt: new Date(),
      publishedAt: new Date(),
      featured: false,
    }, { transaction })

    const images = [
      ['ologolo-shortlet-bedroom-1.jpeg', 'Bedroom in the four-bedroom short-let accommodation in Ologolo', true, 0],
      ['ologolo-shortlet-bedroom-2.jpeg', 'Additional bedroom in the four-bedroom short-let accommodation in Ologolo', false, 1],
      ['ologolo-shortlet-dining-1.jpeg', 'Dining area in the short-let accommodation in Ologolo', false, 2],
      ['ologolo-shortlet-dining-2.jpeg', 'Additional view of the dining area in the short-let accommodation in Ologolo', false, 3],
    ]

    await PropertyImage.bulkCreate(images.map(([filename, altText, isPrimary, displayOrder]) => ({
      propertyId: property.id,
      imageUrl: `/uploads/properties/${filename}`,
      altText,
      isPrimary,
      displayOrder,
    })), { transaction })

    await transaction.commit()

    console.log('SUCCESS: Ologolo short-let property created and approved.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Property URL slug: ${slug}`)
    console.log('Rate: NGN 50,000 per night')
    console.log('Bedrooms: 4')
    console.log('Images: 4')
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    throw error
  }
}

addOlogoloShortlet()
  .catch((error) => {
    console.error('FAILED:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await sequelize.close()
  })
