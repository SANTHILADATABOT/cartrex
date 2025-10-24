const express = require("express");
const router = express.Router();
const carrierController = require("../../controllers/admin/carrierListingController");


// GET all carriers
router.get('/getallcarriers', carrierController.getallcarriers);

// UPDATE carrier
router.put('/updatecarrier/:userId', carrierController.updatecarrier);

router.put('/updatecarrierstatusbyId/:carrierId',carrierController.updateCarrierStatusById);

// DELETE (soft delete) carrier
router.delete('/deletecarrier/:userId', carrierController.deletecarrier);



module.exports = router;
