const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define('Enquiry', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    propertyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'property_id' },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'user_id' },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM('new', 'contacted', 'closed'),
      defaultValue: 'new',
    },
  }, {
    tableName: 'enquiries',
    timestamps: true,
    underscored: true,
  })
