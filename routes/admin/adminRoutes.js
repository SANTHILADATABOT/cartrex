const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../../middleware/auth');
const adminController = require('../../controllers/admin/adminController');

// ---------------------- Dashboard --------------------------
router.get('/dashboard', protect, authorize('admin'), adminController.getDashboard);

// ---------------------- Admin Users ----------------------
router.get('/users', protect, authorize('admin'), adminController.getAdminUsers);
router.post('/users', protect, authorize('admin'), adminController.createAdminUser);
router.put('/users/:id', protect, authorize('admin'), adminController.updateAdminUser);

// ---------------------- Bookings ----------------------
router.get('/bookings', protect, authorize('admin'), adminController.getBookings);

// ---------------------- Reports / Analytics ----------------------
router.get('/reports', protect, authorize('admin'), adminController.getReports);

module.exports = router;
