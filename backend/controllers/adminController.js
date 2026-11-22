
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { Property, PropertyImage, User } = require('../models')

const getProperties = async (req, res, next) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
    } = req.query

    const currentPage = Math.max(parseInt(page, 10) || 1, 1)
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100)

    const where = {}

    const allowedStatuses = [
      'draft',
      'pending',
      'approved',
      'rejected',
      'archived',
    ]

    if (status && allowedStatuses.includes(status)) {
      where.status = status
    }

    const result = await Property.findAndCountAll({
      where,
      include: [{
        model: PropertyImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
      }],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      distinct: true,
    })

    return res.status(200).json({
      success: true,
      total: result.count,
      page: currentPage,
      pages: Math.ceil(result.count / pageSize),
      properties: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

const getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.findAll({
      where: { status: 'pending' },
      include: [{
        model: PropertyImage,
        as: 'images',
        attributes: ['id', 'imageUrl', 'altText', 'isPrimary'],
      }],
      order: [['createdAt', 'ASC']],
    })

    return res.status(200).json({
      success: true,
      total: properties.length,
      properties,
    })
  } catch (error) {
    next(error)
  }
}

const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findByPk(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      })
    }

    if (property.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending properties can be approved.',
      })
    }

    await property.update({
      status: 'approved',
      approvedByUserId: req.user.id,
      approvedAt: new Date(),
      publishedAt: new Date(),
      rejectionReason: null,
    })

    return res.status(200).json({
      success: true,
      message: 'Property approved and published successfully.',
      property,
    })
  } catch (error) {
    next(error)
  }
}

const rejectProperty = async (req, res, next) => {
  try {
    const { reason } = req.body

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A rejection reason is required.',
      })
    }

    const property = await Property.findByPk(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      })
    }

    if (property.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending properties can be rejected.',
      })
    }

    await property.update({
      status: 'rejected',
      rejectionReason: reason.trim(),
    })

    return res.status(200).json({
      success: true,
      message: 'Property rejected.',
      property,
    })
  } catch (error) {
    next(error)
  }
}

// SUPER ADMIN: View administrator accounts.
const getAdministrators = async (req, res, next) => {
  try {
    const administrators = await User.findAll({
      where: {
        role: {
          [Op.in]: ['admin', 'staff'],
        },
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'role',
        'isActive',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    })

    return res.status(200).json({
      success: true,
      total: administrators.length,
      administrators,
    })
  } catch (error) {
    next(error)
  }
}

// SUPER ADMIN: Create an administrator account.
const createAdministrator = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role = 'admin',
    } = req.body

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email and password are required.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.',
      })
    }

    if (!['admin', 'staff'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Only Admin and Staff accounts can be created here.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const administrator = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || null,
      password: hashedPassword,
      role,
      isActive: true,
    })

    return res.status(201).json({
      success: true,
      message: `${role === 'admin' ? 'Administrator' : 'Staff'} account created successfully.`,
      administrator: {
        id: administrator.id,
        firstName: administrator.firstName,
        lastName: administrator.lastName,
        email: administrator.email,
        phone: administrator.phone,
        role: administrator.role,
        isActive: administrator.isActive,
        createdAt: administrator.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// SUPER ADMIN: Activate or deactivate an Admin or Staff account.
const updateAdministratorStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'A valid account status is required.',
      })
    }

    const administrator = await User.findByPk(req.params.id)

    if (!administrator) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found.',
      })
    }

    if (!['admin', 'staff'].includes(administrator.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only Admin and Staff accounts can be managed here.',
      })
    }

    await administrator.update({ isActive })

    return res.status(200).json({
      success: true,
      message: `Account ${isActive ? 'activated' : 'deactivated'} successfully.`,
      administrator: {
        id: administrator.id,
        firstName: administrator.firstName,
        lastName: administrator.lastName,
        email: administrator.email,
        role: administrator.role,
        isActive: administrator.isActive,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getAdministrators,
  createAdministrator,
  updateAdministratorStatus,
}
