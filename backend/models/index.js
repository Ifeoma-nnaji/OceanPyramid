const sequelize = require('../database/sequelize')

const User = require('./User')(sequelize)
const Agency = require('./Agency')(sequelize)
const AgentProfile = require('./AgentProfile')(sequelize)
const Property = require('./Property')(sequelize)
const PropertyImage = require('./PropertyImage')(sequelize)
const Enquiry = require('./Enquiry')(sequelize)
const ViewingRequest = require('./ViewingRequest')(sequelize)

// User and agency relationships
User.hasMany(Agency, { foreignKey: 'ownerUserId', as: 'ownedAgencies' })
Agency.belongsTo(User, { foreignKey: 'ownerUserId', as: 'owner' })

User.hasOne(AgentProfile, { foreignKey: 'userId', as: 'agentProfile' })
AgentProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Agency.hasMany(AgentProfile, { foreignKey: 'agencyId', as: 'agents' })
AgentProfile.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' })

// Property ownership and listing relationships
User.hasMany(Property, { foreignKey: 'createdByUserId', as: 'submittedProperties' })
Property.belongsTo(User, { foreignKey: 'createdByUserId', as: 'creator' })

User.hasMany(Property, { foreignKey: 'approvedByUserId', as: 'approvedProperties' })
Property.belongsTo(User, { foreignKey: 'approvedByUserId', as: 'approver' })

AgentProfile.hasMany(Property, { foreignKey: 'agentProfileId', as: 'properties' })
Property.belongsTo(AgentProfile, { foreignKey: 'agentProfileId', as: 'agent' })

Agency.hasMany(Property, { foreignKey: 'agencyId', as: 'properties' })
Property.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' })

// Property images, enquiries and viewings
Property.hasMany(PropertyImage, {
  foreignKey: 'propertyId',
  as: 'images',
  onDelete: 'CASCADE',
})
PropertyImage.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

Property.hasMany(Enquiry, { foreignKey: 'propertyId', as: 'enquiries' })
Enquiry.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

User.hasMany(Enquiry, { foreignKey: 'userId', as: 'enquiries' })
Enquiry.belongsTo(User, { foreignKey: 'userId', as: 'customer' })

Property.hasMany(ViewingRequest, { foreignKey: 'propertyId', as: 'viewingRequests' })
ViewingRequest.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' })

User.hasMany(ViewingRequest, { foreignKey: 'userId', as: 'viewingRequests' })
ViewingRequest.belongsTo(User, { foreignKey: 'userId', as: 'customer' })

module.exports = {
  sequelize,
  User,
  Agency,
  AgentProfile,
  Property,
  PropertyImage,
  Enquiry,
  ViewingRequest,
}
