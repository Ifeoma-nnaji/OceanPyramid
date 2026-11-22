'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM(
        'super_admin',
        'admin',
        'staff',
        'agent',
        'landlord',
        'developer',
        'customer'
      ),
      allowNull: false,
      defaultValue: 'customer',
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM(
        'admin',
        'staff',
        'agent',
        'landlord',
        'developer',
        'customer'
      ),
      allowNull: false,
      defaultValue: 'customer',
    })
  },
}
