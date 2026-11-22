require('dotenv').config()

const bcrypt = require('bcryptjs')
const { User, sequelize } = require('../models')

async function createSuperAdmin() {
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
      throw new Error('Missing Super Admin environment variables.')
    }

    if (SUPER_ADMIN_PASSWORD.length < 12) {
      throw new Error('Password must contain at least 12 characters.')
    }

    const email = SUPER_ADMIN_EMAIL.trim().toLowerCase()

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      throw new Error('This email already exists. No account was changed.')
    }

    const password = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12)

    const user = await User.create({
      firstName: SUPER_ADMIN_FIRST_NAME.trim(),
      lastName: SUPER_ADMIN_LAST_NAME.trim(),
      email,
      password,
      role: 'super_admin',
      isActive: true,
    })

    console.log('Super Admin account created successfully.')
    console.log('Email:', user.email)
    console.log('User ID:', user.id)
    console.log('Role:', user.role)
  } catch (error) {
    console.error('Super Admin setup failed:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

createSuperAdmin()
