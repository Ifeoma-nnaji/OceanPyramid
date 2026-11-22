const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define('ViewingRequest', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    propertyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'property_id' },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'user_id' },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(191), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },
    preferredDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'preferred_date' },
    preferredTime: { type: DataTypes.STRING(30), allowNull: true, field: 'preferred_time' },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM('requested', 'confirmed', 'completed', 'cancelled'),
      defaultValue: 'requested',
    },
  }, {
    tableName: 'viewing_requests',
    timestamps: true,
    underscored: true,
  })
