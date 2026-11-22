
const env = require('./env.config')
const dbConfig = require('./db.config')

module.exports = {
  app: {
    environment: env.NODE_ENV,
    port: env.PORT,
    clientUrl: env.CLIENT_URL,
  },

  database: dbConfig,

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
}
