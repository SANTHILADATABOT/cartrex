const express = require('express');
const router = express.Router();
const truckController = require('../../controllers/admin/truckListingController');

// Get all trucks
router.get('/getalltrucks', truckController.getalltrucks);

// Update truck by ID
router.put('/updatetruck/:truckId', truckController.updatetruck);

// Soft delete truck
router.delete('/deletetruck/:truckId', truckController.deletetruck);

module.exports = router;
