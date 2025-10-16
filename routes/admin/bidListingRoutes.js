const express = require('express');
const router = express.Router();
const bidController = require('../../controllers/admin/bidListingController');

// GET all bids
router.get('/getallbids', bidController.getallbids);

// UPDATE bid
router.put('/updatebid/:bidId', bidController.updatebid);

// DELETE bid
router.delete('/deletebid/:bidId', bidController.deletebid);

module.exports = router;
