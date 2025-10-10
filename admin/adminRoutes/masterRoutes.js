const express = require('express');
const router = express.Router();
const masterController = require('../adminController/masterController');
// const { verifyToken } = require('../middlewares/authMiddleware'); // optional if auth required

// 🧩 Routes

// Create new Master Data
router.post('/createmaster', masterController.createMaster);

// Get all Master Data
router.get('/getallmasters', masterController.getAllMasters);

// Get single Master Data by ID
router.get('/getmastersbyid/:id', masterController.getMasterById);

// Update Master Data by ID
router.put('/updatemaster/:id',  masterController.updateMaster);

// Soft delete Master Data by ID
router.delete('/deletemaster/:id', masterController.deleteMaster);

module.exports = router;
