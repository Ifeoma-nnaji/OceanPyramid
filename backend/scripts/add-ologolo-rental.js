const { sequelize, User, Property, PropertyImage } = require('../models')

async function addOlogoloRental() {
  const transaction = await sequelize.transaction()

  try {
    // The existing Super Admin account (ID 7) is used as the listing owner
    // and approver so this manually published listing has a valid audit trail.
    const admin = await User.findByPk(7, { transaction })
    if (!admin) {
      throw new Error('Super Admin user ID 7 was not found. No property was created.')
    }

    const slug = '4-bedroom-detached-duplex-for-rent-ologolo-lekki'
    const existing = await Property.findOne({ where: { slug }, transaction })
    if (existing) {
      throw new Error(`A property with slug "${slug}" already exists (ID ${existing.id}). No duplicate was created.`)
    }

    const property = await Property.create({
      createdByUserId: admin.id,
      approvedByUserId: admin.id,
      title: '4-Bedroom Detached Duplex for Rent in Ologolo, Lekki',
      slug,
      description: 'A four-bedroom detached duplex located in Ologolo, Lekki, Lagos. The property includes five toilets, a store room and a dedicated office. Contact Ocean Pyramid Properties to arrange an inspection and obtain further property information.',
      purpose: 'rent',
      category: 'duplex',
      price: 14000000,
      currency: 'NGN',
      priceNegotiable: false,
      bedrooms: 4,
      bathrooms: null,
      toilets: 5,
      address: 'Ologolo, Lekki',
      neighborhood: 'Ologolo',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      amenities: ['Store room', 'Office'],
      status: 'approved',
      approvedAt: new Date(),
      publishedAt: new Date(),
      featured: false,
    }, { transaction })

    const imageFiles = [
      ['ologolo-detached-duplex-exterior-front.jpeg', 'Front exterior of the four-bedroom detached duplex in Ologolo', true, 0],
      ['ologolo-detached-duplex-exterior-side.jpeg', 'Additional exterior view of the detached duplex in Ologolo', false, 1],
      ['ologolo-detached-duplex-living-room.jpeg', 'Living room of the detached duplex in Ologolo', false, 2],
    ]

    await PropertyImage.bulkCreate(imageFiles.map(([filename, altText, isPrimary, displayOrder]) => ({
      propertyId: property.id,
      imageUrl: `/uploads/properties/${filename}`,
      altText,
      isPrimary,
      displayOrder,
    })), { transaction })

    await transaction.commit()
    console.log('SUCCESS: Ologolo rental property created and approved.')
    console.log(`Property ID: ${property.id}`)
    console.log(`Property URL: http://localhost:5174/properties/${slug}`)
    console.log('Rent: NGN 14,000,000 per year')
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    throw error
  } finally {
    await sequelize.close()
  }
}

addOlogoloRental().catch((error) => {
  console.error('FAILED:', error.message)
  process.exitCode = 1
})
