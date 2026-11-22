const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define('Agency', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    ownerUserId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'owner_user_id' },
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
  }, {
    tableName: 'agencies',
    timestamps: true,
    underscored: true,
  })
