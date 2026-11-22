
require('dotenv').config()

const bcrypt = require('bcryptjs')
const { User, sequelize } = require('../models')

const createSuperAdmin = async () => {
  try {
    const {
      SUPER_ADMIN_FIRST_NAME,
      SUPER_ADMIN_LAST_NAME,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD,
    } = process.env

    if (
      !SUPER_ADMIN_FIRST_NAME ||
      !SUPER_ADMIN_LAST_NAME ||
      !SUPER_ADMIN_EMAIL ||
      !SUPER_ADMIN_PASSWORD
    ) {
      throw new Error(
        'Set all SUPER_ADMIN environment variables before running this script.'
      )
    }

    if (SUPER_ADMIN_PASSWORD.length < 12) {
      throw new Error(
        'Super Admin password must contain at least 12 characters.'
      )
    }

    const email = SUPER_ADMIN_EMAIL.toLowerCase().trim()

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      throw new Error(
        'An account with this email already exists. No account was changed. Please inspect the existing account first.'
      )
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12)

    const superAdmin = await User.create({
      firstName: SUPER_ADMIN_FIRST_NAME.trim(),
      lastName: SUPER_ADMIN_LAST_NAME.trim(),
      email,
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    })

    console.log('Super Admin account created successfully.')
    console.log(`Email: ${superAdmin.email}`)
    console.log(`User ID: ${superAdmin.id}`)
    console.log(`Role: ${superAdmin.role}`)
  } catch (error) {
    console.error('Super Admin setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

createSuperAdmin()
