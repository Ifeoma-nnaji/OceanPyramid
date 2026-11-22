'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize

    await queryInterface.createTable('users', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      firstName: { type: DataTypes.STRING(100), allowNull: false, field: 'first_name' },
      lastName: { type: DataTypes.STRING(100), allowNull: false, field: 'last_name' },
      email: { type: DataTypes.STRING(191), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      password: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM('admin', 'staff', 'agent', 'landlord', 'developer', 'customer'),
        allowNull: false,
        defaultValue: 'customer',
      },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'is_active' },
      emailVerifiedAt: { type: DataTypes.DATE, allowNull: true, field: 'email_verified_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.createTable('agencies', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      ownerUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'owner_user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: { type: DataTypes.STRING(180), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      email: { type: DataTypes.STRING(191), allowNull: true },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      address: { type: DataTypes.STRING(255), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: true },
      state: { type: DataTypes.STRING(100), allowNull: true },
      logo: { type: DataTypes.STRING(500), allowNull: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.createTable('agent_profiles', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      agencyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'agency_id',
        references: { model: 'agencies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      professionalTitle: { type: DataTypes.STRING(150), allowNull: true, field: 'professional_title' },
      bio: { type: DataTypes.TEXT, allowNull: true },
      profileImage: { type: DataTypes.STRING(500), allowNull: true, field: 'profile_image' },
      yearsExperience: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'years_experience' },
      licenseNumber: { type: DataTypes.STRING(100), allowNull: true, field: 'license_number' },
      isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_verified' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.createTable('properties', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      createdByUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'created_by_user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      agentProfileId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'agent_profile_id',
        references: { model: 'agent_profiles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      agencyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'agency_id',
        references: { model: 'agencies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      title: { type: DataTypes.STRING(220), allowNull: false },
      slug: { type: DataTypes.STRING(250), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT('long'), allowNull: false },
      purpose: {
        type: DataTypes.ENUM('sale', 'rent', 'short_let'),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
      currency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: 'NGN' },
      priceNegotiable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'price_negotiable' },
      bedrooms: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      bathrooms: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      toilets: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
      area: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
      areaUnit: { type: DataTypes.STRING(30), allowNull: true, field: 'area_unit' },
      landSize: { type: DataTypes.DECIMAL(12, 2), allowNull: true, field: 'land_size' },
      landSizeUnit: { type: DataTypes.STRING(30), allowNull: true, field: 'land_size_unit' },
      address: { type: DataTypes.STRING(255), allowNull: false },
      neighborhood: { type: DataTypes.STRING(120), allowNull: true },
      city: { type: DataTypes.STRING(100), allowNull: false },
      state: { type: DataTypes.STRING(100), allowNull: false },
      country: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Nigeria' },
      latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      furnished: { type: DataTypes.BOOLEAN, allowNull: true },
      amenities: { type: DataTypes.JSON, allowNull: true },
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected', 'archived'),
        allowNull: false,
        defaultValue: 'pending',
      },
      rejectionReason: { type: DataTypes.TEXT, allowNull: true, field: 'rejection_reason' },
      approvedByUserId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'approved_by_user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      publishedAt: { type: DataTypes.DATE, allowNull: true, field: 'published_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.addIndex('properties', ['purpose', 'status'])
    await queryInterface.addIndex('properties', ['category', 'status'])
    await queryInterface.addIndex('properties', ['state', 'city'])
    await queryInterface.addIndex('properties', ['price'])

    await queryInterface.createTable('property_images', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      propertyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'property_id',
        references: { model: 'properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      imageUrl: { type: DataTypes.STRING(1000), allowNull: false, field: 'image_url' },
      altText: { type: DataTypes.STRING(255), allowNull: true, field: 'alt_text' },
      isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_primary' },
      displayOrder: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0, field: 'display_order' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.createTable('enquiries', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      propertyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'property_id',
        references: { model: 'properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: true },
      message: { type: DataTypes.TEXT, allowNull: false },
      status: {
        type: DataTypes.ENUM('new', 'contacted', 'closed'),
        allowNull: false,
        defaultValue: 'new',
      },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })

    await queryInterface.createTable('viewing_requests', {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      propertyId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'property_id',
        references: { model: 'properties', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'user_id',
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: { type: DataTypes.STRING(150), allowNull: false },
      email: { type: DataTypes.STRING(191), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: false },
      preferredDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'preferred_date' },
      preferredTime: { type: DataTypes.STRING(30), allowNull: true, field: 'preferred_time' },
      message: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM('requested', 'confirmed', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'requested',
      },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('viewing_requests')
    await queryInterface.dropTable('enquiries')
    await queryInterface.dropTable('property_images')
    await queryInterface.dropTable('properties')
    await queryInterface.dropTable('agent_profiles')
    await queryInterface.dropTable('agencies')
    await queryInterface.dropTable('users')
  },
}
