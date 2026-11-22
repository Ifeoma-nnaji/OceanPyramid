require('dotenv').config()

const bcrypt = require('bcryptjs')
const { User } = require('../models')

const createAdmin = async () => {
  try {
    const {
      ADMIN_FIRST_NAME,
      ADMIN_LAST_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env

    if (!ADMIN_FIRST_NAME || !ADMIN_LAST_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'Set ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL and ADMIN_PASSWORD before running this script.'
      )
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error('Administrator password must contain at least 12 characters.')
    }

    const email = ADMIN_EMAIL.toLowerCase().trim()

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      throw new Error(
        'An account with this email already exists. No account was changed.'
      )
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)

    const admin = await User.create({
      firstName: ADMIN_FIRST_NAME.trim(),
      lastName: ADMIN_LAST_NAME.trim(),
      email,
      password: hashedPassword,
      role: 'admin',
    })

    console.log('Administrator account created successfully.')
    console.log(`Admin email: ${admin.email}`)
    console.log(`Admin user ID: ${admin.id}`)
  } catch (error) {
    console.error('Admin setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await require('../models').sequelize.close()
  }
}

createAdmin()
