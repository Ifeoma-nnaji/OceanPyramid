const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { sequelize, User, AgentProfile } = require('../models')

// Privileged roles are intentionally excluded from public registration.
const PUBLIC_REGISTRATION_ROLES = ['customer', 'agent', 'landlord', 'developer']

const createToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )

const toPublicUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
})

const register = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { firstName, lastName, email, password, phone, role } = req.body

    if (!PUBLIC_REGISTRATION_ROLES.includes(role)) {
      await transaction.rollback()
      return res.status(403).json({
        success: false,
        message: 'Please select a valid public account type.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
      transaction,
    })

    if (existingUser) {
      await transaction.rollback()
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      password: hashedPassword,
      role,
    }, { transaction })

    if (user.role === 'agent') {
      await AgentProfile.create({ userId: user.id }, { transaction })
    }

    await transaction.commit()
    const token = createToken(user)

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: toPublicUser(user),
    })
  } catch (error) {
    if (!transaction.finished) await transaction.rollback()
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled.',
      })
    }

    const token = createToken(user)
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: toPublicUser(user),
    })
  } catch (error) {
    next(error)
  }
}

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  })
}

module.exports = { register, login, getMe }
