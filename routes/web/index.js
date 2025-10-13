const express = require('express');
const router = express.Router();
const { protect, authorize, requireProfileComplete } = require('../../middleware/auth');

// Carrier-specific routes
router.use('/trucks', require('./trucks'));
router.use('/spaces', require('./spaces'));
router.use('/bookings', require('./bookings'));
router.use('/shipper', require('./shippers'));
router.use('/carrier', require('./carriers'));

module.exports = router;