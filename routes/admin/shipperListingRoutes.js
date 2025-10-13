const express = require('express');
const router = express.Router();
const shipperController = require('../../controllers/admin/shipperListingController');

// Get all shippers
router.get('/getallshippers', shipperController.getallshippers);

// Update shipper 
router.put('/updateshipper/:userId', shipperController.updateshipper);

// Delete shipper 
router.delete('/deleteshipper/:userId', shipperController.deleteshipper);

module.exports = router;
