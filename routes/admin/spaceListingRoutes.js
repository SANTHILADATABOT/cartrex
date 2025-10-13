const express = require('express');
const router = express.Router();
const {
  getAllSpaces,
  updateSpaceStatus,
  DeleteSpace
} = require('../../controllers/admin/spaceListingController');

router.get('/getallspaces', getAllSpaces);
router.put('/updatespacestatus/:id', updateSpaceStatus);
router.delete('/deletespace/:id', DeleteSpace);

module.exports = router;
