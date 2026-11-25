const express = require('express')
const router = express.Router()

const {
  getProperties,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  archiveProperty,
  getAdministrators,
  createAdministrator,
  updateAdministratorStatus,
} = require('../controllers/adminController')

const { protect, authorize } = require('../middleware/authMiddleware')

// Both Super Admin and Admin can manage property listings.
router.use(protect, authorize('super_admin', 'admin'))

router.get('/properties/pending', getPendingProperties)
router.get('/properties', getProperties)
router.patch('/properties/:id/approve', approveProperty)
router.patch('/properties/:id/reject', rejectProperty)
router.patch('/properties/:id/archive', archiveProperty)

// Only Super Admin can manage administrator accounts.
router.get(
  '/administrators',
  authorize('super_admin'),
  getAdministrators
)

router.post(
  '/administrators',
  authorize('super_admin'),
  createAdministrator
)

router.patch(
  '/administrators/:id/status',
  authorize('super_admin'),
  updateAdministratorStatus
)

module.exports = router
