
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')

const config = require('./config/config')
const authRoutes = require('./routes/authRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const adminRoutes = require('./routes/adminRoutes')
const errorHandler = require('./middleware/errorMiddleware')

const app = express()

app.use(helmet({
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },
}))

app.use(cors({
  origin: config.app.clientUrl,
  credentials: true,
}))

if (config.app.environment === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})

app.use('/api', apiLimiter)

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ocean Pyramids API is running.',
    environment: config.app.environment,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  })
})

app.use(errorHandler)

module.exports = app
