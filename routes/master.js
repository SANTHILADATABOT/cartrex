const express = require('express');
const router = express.Router();
const masterController = require('../controller/masterController');

// Add or update vehicle types
router.post('/vehicles', masterController.createOrUpdateVehicles);

// Add or update truck types
router.post('/truck', masterController.createOrUpdateTruck);

// Add or update locations
router.post('/locations', masterController.createOrUpdateLocations);

module.exports = router;
