const express = require('express');
const router = express.Router();
const truckController = require('../controller/truckController');
const { protect, authorize, requireProfileComplete } = require('../middleware/auth');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, authorize('carrier'), requireProfileComplete, upload.fields([
  { name: 'insurance', maxCount: 1 },
  { name: 'coverPhoto', maxCount: 1 },
  { name: 'photos', maxCount: 6 }
]), truckController.createTruck);

router.get('/', protect, truckController.getTrucks);

router.get('/:id', protect, truckController.getTruckById);

router.put('/:id', protect, authorize('carrier'), truckController.updateTruck);

router.delete('/:id', protect, authorize('carrier'), truckController.deleteTruck);

module.exports = router;
