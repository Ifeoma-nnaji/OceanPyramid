const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define('AgentProfile', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true, field: 'user_id' },
    agencyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'agency_id' },
    professionalTitle: { type: DataTypes.STRING(150), allowNull: true, field: 'professional_title' },
    bio: { type: DataTypes.TEXT, allowNull: true },
    profileImage: { type: DataTypes.STRING(500), allowNull: true, field: 'profile_image' },
    yearsExperience: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'years_experience' },
    licenseNumber: { type: DataTypes.STRING(100), allowNull: true, field: 'license_number' },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_verified' },
  }, {
    tableName: 'agent_profiles',
    timestamps: true,
    underscored: true,
  })
