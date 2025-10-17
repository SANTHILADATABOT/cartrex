// routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/admin/adminUserlistController');

// Creat Admin User
router.post('/createadminuser', adminUserController.createadminuser);


// GetAll Admin User
router.get('/getalladminusers', adminUserController.getalladminusers);

// Update Admin User
router.put('/updateadminuser/:adminid', adminUserController.updateadminuser);

// Delete Admin User
router.delete('/deleteadminuser/:adminid', adminUserController.deleteadminuser);

module.exports = router;
