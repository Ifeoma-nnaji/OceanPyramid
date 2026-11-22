const { body } = require('express-validator')

const createPropertyValidator = [
  body('title').trim().notEmpty().withMessage('Property title is required.'),
  body('description').trim().notEmpty().withMessage('Property description is required.'),
  body('purpose')
    .isIn(['sale', 'rent', 'short_let'])
    .withMessage('Purpose must be sale, rent or short_let.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Property category is required.'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Enter a valid property price.'),
  body('address').trim().notEmpty().withMessage('Property address is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('state').trim().notEmpty().withMessage('State is required.'),
]

module.exports = { createPropertyValidator }
