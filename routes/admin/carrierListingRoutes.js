const express = require("express");
const router = express.Router();
const carrierController = require("../../controllers/admin/carrierListingController");

// Creat carrier User
router.post('/createCarrierUser', carrierController.addcarrier);
// GET all carriers
router.get('/getallcarriers', carrierController.getallcarriers);



// UPDATE carrier
router.put('/updatecarrier/:userId', carrierController.updatecarrier);

router.put('/updatecarrierstatusbyId/:carrierId',carrierController.updateCarrierStatusById);

router.get('/getcarrierbyId/:carrierId', carrierController.getcarrierbyId);

// DELETE (soft delete) carrier
router.delete('/deletecarrier/:userId', carrierController.deletecarrier);

//Get By id 
router.get('/getcarrierbyid/:userid', carrierController.getcarrierbyid);



module.exports = router;
