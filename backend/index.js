
const app = require('./app')
const config = require('./config/config')
const connectDb = require('./database/connectDb')

const startServer = async () => {
  try {
    await connectDb()

    app.listen(config.app.port, () => {
      console.log(
        `Ocean Pyramids API running on http://localhost:${config.app.port}`
      )
    })
  } catch (error) {
    console.error('Failed to start Ocean Pyramids server:', error.message)
    process.exit(1)
  }
}

startServer()

