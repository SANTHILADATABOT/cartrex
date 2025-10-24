const express = require("express");
const router = express.Router();
const carrierController = require("../../controllers/admin/carrierListingController");

// Creat carrier User
router.post('/createCarrierUser', carrierController.addcarrier);
// GET all carriers
router.get('/getallcarriers', carrierController.getallcarriers);

// UPDATE carrier
router.put('/updatecarrier/:userId', carrierController.updatecarrier);

// DELETE (soft delete) carrier
router.delete('/deletecarrier/:userId', carrierController.deletecarrier);



module.exports = router;
