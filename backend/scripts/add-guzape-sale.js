require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { sequelize, User, Property, PropertyImage } = require('../models')

const ADMIN_USER_ID = 7
const PROPERTY_SLUG = '5-bedroom-semi-detached-duplex-for-sale-guzape-abuja'
const uploadDirectory = path.join(__dirname, '..', 'uploads', 'properties')

const photos = [
  {
    file: 'guzape-exterior-1.jpeg',
    altText: 'Exterior view of the five-bedroom semi-detached duplex in Guzape, Abuja',
  },
  {
    file: 'guzape-exterior-2.jpeg',
    altText: 'Additional exterior and compound view of the property in Guzape, Abuja',
  },
]

async function addGuzapeProperty() {
  let transaction

  try {
    await sequelize.authenticate()

    const admin = await User.findByPk(ADMIN_USER_ID)
    if (!admin) {
      throw new Error(`User account ID ${ADMIN_USER_ID} was not found. No property was inserted.`)
    }

    const existing = await Property.findOne({ where: { slug: PROPERTY_SLUG } })
    if (existing) {
      console.log('This Guzape property already exists.')
      console.log(`Property ID: ${existing.id}`)
      console.log(`Status: ${existing.status}`)
      return
    }

    for (const photo of photos) {
      const fullPath = path.join(uploadDirectory, photo.file)
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Missing property photo: ${fullPath}`)
      }
    }

    transaction = await sequelize.transaction()

    const property = await Property.create({
      createdByUserId: ADMIN_USER_ID,
      approvedByUserId: ADMIN_USER_ID,
      title: '5-Bedroom Semi-Detached Duplex for Sale in Guzape, Abuja',
      slug: PROPERTY_SLUG,
      description: 'Five-bedroom semi-detached duplex located in Guzape, Abuja. The property photographs show the building exterior, balconies and paved compound. Further property details can be added when confirmed.',
      purpose: 'sale',
      category: 'semi-detached duplex',
      price: 600000000,
      currency: 'NGN',
      priceNegotiable: false,
      bedrooms: 5,
      bathrooms: null,
      toilets: null,
      address: 'Guzape',
      neighborhood: 'Guzape',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      status: 'approved',
      approvedAt: new Date(),
      publishedAt: new Date(),
      featured: false,
    }, { transaction })

    await PropertyImage.bulkCreate(
      photos.map((photo, index) => ({
        propertyId: property.id,
        imageUrl: `/uploads/properties/${photo.file}`,
        altText: photo.altText,
        isPrimary: index === 0,
        displayOrder: index,
      })),
      { transaction }
    )

    await transaction.commit()
    transaction = null

    console.log('\nSUCCESS: Guzape property created and approved.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Title: ${property.title}`)
    console.log('Price: NGN 600,000,000')
    console.log('Location: Guzape, Abuja, FCT, Nigeria')
    console.log('Bedrooms: 5')
    console.log('Images added: 2 unique photographs (the second and third uploads were identical)')
    console.log(`Slug: ${PROPERTY_SLUG}`)
  } catch (error) {
    if (transaction) await transaction.rollback()
    console.error('\nFAILED: Guzape property was not added.')
    console.error(error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

addGuzapeProperty()
