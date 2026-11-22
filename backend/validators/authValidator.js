const { body } = require('express-validator')

const PUBLIC_REGISTRATION_ROLES = ['customer', 'agent', 'landlord', 'developer']

const registerValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('password').isLength({ min: 8 }).withMessage('Password must contain at least 8 characters.'),
  body('role')
    .exists()
    .withMessage('Please select an account type.')
    .bail()
    .isIn(PUBLIC_REGISTRATION_ROLES)
    .withMessage('Please select a valid account type.'),
]

const loginValidator = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
]

module.exports = { registerValidator, loginValidator }
