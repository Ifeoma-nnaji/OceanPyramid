const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define('PropertyImage', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    propertyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'property_id' },
    imageUrl: { type: DataTypes.STRING(1000), allowNull: false, field: 'image_url' },
    altText: { type: DataTypes.STRING(255), allowNull: true, field: 'alt_text' },
    isPrimary: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_primary' },
    displayOrder: { type: DataTypes.INTEGER.UNSIGNED, defaultValue: 0, field: 'display_order' },
  }, {
    tableName: 'property_images',
    timestamps: true,
    underscored: true,
  })
