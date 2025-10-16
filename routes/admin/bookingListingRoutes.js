const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/admin/bookingListingController');

// ✅ GET all bookings
router.get('/getallbookings', bookingController.getallbookings);

// ✅ UPDATE booking
router.put('/updatebooking/:bookingId', bookingController.updatebooking);

// ✅ DELETE booking (soft delete)
router.delete('/deletebooking/:bookingId', bookingController.deletebooking);


module.exports = router;
