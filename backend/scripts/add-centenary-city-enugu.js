require('dotenv').config()
const { sequelize, User, Property, PropertyImage } = require('../models')

async function main() {
  await sequelize.authenticate()

  const admin = await User.findByPk(7)
  if (!admin) {
    throw new Error('Super Admin user ID 7 was not found. No property was inserted.')
  }

  const slug = '4-bedroom-duplex-for-sale-centenary-city-enugu'
  const existing = await Property.findOne({ where: { slug } })

  if (existing) {
    console.log(`Property already exists (ID: ${existing.id}). No duplicate was created.`)
    return
  }

  const transaction = await sequelize.transaction()
  try {
    const property = await Property.create({
      createdByUserId: admin.id,
      title: '4-Bedroom Duplex for Sale in Centenary City, Enugu',
      slug,
      description: 'A four-bedroom duplex offered for sale in Centenary City, Enugu. The listing photographs show the building exterior and gated frontage. Further property details can be added when confirmed.',
      purpose: 'sale',
      category: 'duplex',
      price: 120000000,
      currency: 'NGN',
      bedrooms: 4,
      address: 'Centenary City',
      neighborhood: 'Centenary City',
      city: 'Enugu',
      state: 'Enugu',
      country: 'Nigeria',
      status: 'approved',
      approvedByUserId: admin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    }, { transaction })

    await PropertyImage.bulkCreate([
      {
        propertyId: property.id,
        imageUrl: '/uploads/properties/centenary-city-enugu-exterior-1.jpeg',
        altText: 'Exterior of the four-bedroom duplex in Centenary City, Enugu',
        isPrimary: true,
        displayOrder: 0,
      },
      {
        propertyId: property.id,
        imageUrl: '/uploads/properties/centenary-city-enugu-exterior-2.jpeg',
        altText: 'Additional exterior view of the duplex in Centenary City, Enugu',
        isPrimary: false,
        displayOrder: 1,
      },
    ], { transaction })

    await transaction.commit()
    console.log('SUCCESS: Centenary City duplex created and approved.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Price: NGN 120,000,000`)
    console.log(`Bedrooms: 4`)
    console.log(`Images: 2`)
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    throw error
  }
}

main()
  .catch((error) => {
    console.error('PROPERTY INSERT FAILED:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await sequelize.close()
  })
