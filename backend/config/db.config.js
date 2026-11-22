
const env = require('./env.config')

const databaseConfig = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: false,
}

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: databaseConfig,
}
