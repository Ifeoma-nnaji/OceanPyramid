const { sequelize, User, Property, PropertyImage } = require('../models')

async function addFO1DutseLand() {
  const transaction = await sequelize.transaction()

  try {
    const admin = await User.findByPk(7, { transaction })
    if (!admin) {
      throw new Error('Super Admin user ID 7 was not found. No property was created.')
    }

    const slug = 'walled-land-with-security-house-fo1-dutse-abuja'
    const existing = await Property.findOne({ where: { slug }, transaction })
    if (existing) {
      throw new Error(`A property with slug "${slug}" already exists (ID ${existing.id}). No duplicate was created.`)
    }

    const property = await Property.create({
      createdByUserId: admin.id,
      approvedByUserId: admin.id,
      title: 'Walled Land with Security House for Sale in FO1, Dutse, Abuja',
      slug,
      description: 'A plot of land for sale in FO1, Dutse, Abuja. The property is enclosed by a perimeter block wall and includes a security house. Contact Ocean Pyramid Properties for further details and to arrange an inspection.',
      purpose: 'sale',
      category: 'land',
      price: 60000000,
      currency: 'NGN',
      priceNegotiable: false,
      address: 'FO1, Dutse',
      neighborhood: 'FO1, Dutse',
      city: 'Abuja',
      state: 'Federal Capital Territory',
      country: 'Nigeria',
      amenities: ['Perimeter wall', 'Security house'],
      status: 'approved',
      approvedAt: new Date(),
      publishedAt: new Date(),
      featured: false,
    }, { transaction })

    await PropertyImage.create({
      propertyId: property.id,
      imageUrl: '/uploads/properties/fo1-dutse-abuja-land.jpeg',
      altText: 'Walled plot of land with a security house in FO1, Dutse, Abuja',
      isPrimary: true,
      displayOrder: 0,
    }, { transaction })

    await transaction.commit()
    console.log('SUCCESS: FO1 Dutse land listing created and approved.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Property URL: http://localhost:5174/properties/${slug}`)
    console.log('Sale price: NGN 60,000,000')
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    throw error
  } finally {
    await sequelize.close()
  }
}

addFO1DutseLand().catch((error) => {
  console.error('FAILED:', error.message)
  process.exitCode = 1
})
