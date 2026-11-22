const { Sequelize } = require('sequelize')
const env = require('./env.config')
const databaseConfigs = require('./db.config')

const dbConfig =
  databaseConfigs[env.NODE_ENV] || databaseConfigs.development

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
)

const connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL database connected successfully.')
  } catch (error) {
    console.error('Database connection failed:', error.message)
    throw error
  }
}

module.exports = {
  sequelize,
  connectDatabase,
}