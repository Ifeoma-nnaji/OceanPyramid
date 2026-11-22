require('dotenv').config()

const { User, sequelize } = require('../models')

const updateAdminRole = async () => {
  try {
    const user = await User.findOne({
      where: { email: 'marychukwu@gmail.com' },
    })

    if (!user) {
      throw new Error('Account not found.')
    }

    await user.update({ role: 'admin' })

    console.log('Account role successfully updated.')
    console.log('Email:', user.email)
    console.log('Role:', user.role)
  } catch (error) {
    console.error('Update failed:', error.message)
    process.exitCode = 1
  } finally {
    await sequelize.close()
  }
}

updateAdminRole()
