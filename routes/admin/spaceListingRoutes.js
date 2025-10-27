const express = require('express');
const router = express.Router();
const {
  getAllSpaces,
  getspacebyId,
  updateSpaceStatus,
  DeleteSpace
} = require('../../controllers/admin/spaceListingController');

router.get('/getallspaces', getAllSpaces);
router.get('/getspacebyId/:id', getspacebyId);
router.put('/updatespacestatus/:id', updateSpaceStatus);
router.delete('/deletespace/:id', DeleteSpace);

module.exports = router;
