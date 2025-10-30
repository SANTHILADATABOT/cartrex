const express = require('express');
const router = express.Router();
const bidController = require('../../controllers/admin/bidListingController');

// GET all bids
router.get('/getallbids', bidController.getallbids);

router.get('/getbidbyId/:bidId', bidController.getbidbyId);

// UPDATE bid
router.put('/updatebid/:bidId', bidController.updatebid);

router.put('/updatebidstatusbyId/:bidId', bidController.updatebidstatusbyId);

// DELETE bid
router.delete('/deletebid/:bidId', bidController.deletebid);

module.exports = router;
