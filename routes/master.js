const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { verifyToken } = require('../middlewares/authMiddleware'); // optional if auth required

// 🧩 Routes

// Create new Master Data
router.post('/', verifyToken, masterController.createMaster);

// Get all Master Data
router.get('/getAllMasters', masterController.getAllMasters);

// Get single Master Data by ID
router.get('/:id', masterController.getMasterById);

// Update Master Data by ID
router.put('/:id', verifyToken, masterController.updateMaster);

// Soft delete Master Data by ID
router.delete('/:id', verifyToken, masterController.deleteMaster);

module.exports = router;
