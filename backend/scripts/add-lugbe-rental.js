require('dotenv').config()

const { sequelize, User, Property, PropertyImage } = require('../models')

const PROPERTY_SLUG = 'house-for-rent-lugbe-abuja'
const SUPER_ADMIN_ID = 7

async function addLugbeRental() {
  let transaction

  try {
    await sequelize.authenticate()

    const admin = await User.findByPk(SUPER_ADMIN_ID)
    if (!admin || admin.role !== 'super_admin' || !admin.isActive) {
      throw new Error(`User ${SUPER_ADMIN_ID} was not found as an active super_admin. No property was added.`)
    }

    const existing = await Property.findOne({ where: { slug: PROPERTY_SLUG } })
    if (existing) {
      console.log(`This listing already exists (property ID: ${existing.id}). No duplicate was created.`)
      return
    }

    transaction = await sequelize.transaction()

    const property = await Property.create({
      createdByUserId: admin.id,
      title: 'House for Rent in Lugbe, Abuja',
      slug: PROPERTY_SLUG,
      description: 'House available for rent in Lugbe, Abuja. Annual rent: ₦3,000,000. Contact Ocean Pyramid Properties for further details and viewing arrangements.',
      purpose: 'rent',
      category: 'house',
      price: 3000000,
      currency: 'NGN',
      address: 'Lugbe, Abuja, Nigeria',
      neighborhood: 'Lugbe',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      status: 'approved',
      approvedByUserId: admin.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
    }, { transaction })

    await PropertyImage.bulkCreate([
      {
        propertyId: property.id,
        imageUrl: '/uploads/properties/lugbe-house-exterior-1.jpeg',
        altText: 'House for rent in Lugbe, Abuja - front exterior',
        isPrimary: true,
        displayOrder: 0,
      },
      {
        propertyId: property.id,
        imageUrl: '/uploads/properties/lugbe-house-exterior-2.jpeg',
        altText: 'House for rent in Lugbe, Abuja - side exterior',
        isPrimary: false,
        displayOrder: 1,
      },
    ], { transaction })

    await transaction.commit()
    transaction = null

    console.log('Lugbe rental property added successfully.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Title: ${property.title}`)
    console.log('Rent: ₦3,000,000 per year')
    console.log('Location: Lugbe, Abuja, Nigeria')
    console.log('Images: 2')
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback()
    console.error('Could not add Lugbe rental property:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

addLugbeRental()
