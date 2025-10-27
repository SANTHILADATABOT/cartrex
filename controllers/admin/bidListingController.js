const Bid = require('../../models/Bid');
const mongoose = require('mongoose');

// GET all bids
exports.getallbids = async (req, res) => {
  try {
    const bids = await Bid.find({ deletstatus: 0 })
      .populate('shipperId', 'companyName dba')
      .populate('carrierId', 'companyName dba')
      .populate('routeId', 'routeName') 
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    if (!bids.length) {
      return res.status(200).json({
        success: true,
        message: "No bids found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: bids.length,
      message: "Bids fetched successfully",
      data: bids
    });

  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ GET bid by ID
exports.getbidbyId = async (req, res) => {
  try {
    const { bidId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({ success: false, message: "Invalid bid ID" });
    }
    const bid = await Bid.findOne({ _id: bidId, deletstatus: 0 })
      .populate('shipperId', 'companyName dba email')      // from Shipper collection
      .populate('carrierId', 'companyName dba email')      // from Carrier collection
      .populate('routeId', 'routeName origin destination') // from Route collection
      .populate('createdBy', 'firstName lastName email')   // from User
      .populate('updatedBy', 'firstName lastName email');

  
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found or deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bid details fetched successfully",
      data: bid
    });

  } catch (error) {
    console.error("Error fetching bid by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//  UPDATE bid
exports.updatebid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({ success: false, message: "Invalid bid ID" });
    }

    const bid = await Bid.findOne({ _id: bidId, deletstatus: 0 });
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found or deleted" });
    }

   
    Object.keys(updateData).forEach(f => {
      if (updateData[f] !== undefined) bid[f] = updateData[f];
    });

    bid.updatedAt = new Date();
    bid.updatedBy = req.user?._id || null;
    bid.ipAddress = req.ip || null;
    bid.userAgent = req.headers['user-agent'] || null;

    await bid.save();

    res.status(200).json({
      success: true,
      message: "Bid updated successfully",
      data: bid
    });

  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// DELETE bid 
exports.deletebid = async (req, res) => {
  try {
    const { bidId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({ success: false, message: "Invalid bid ID" });
    }

    const bid = await Bid.findOne({ _id: bidId, deletstatus: 0 });
    if (!bid) {
      return res.status(404).json({ success: false, message: "Bid not found or already deleted" });
    }

    bid.deletstatus = 1;
    bid.deletedAt = new Date();
    bid.deletedBy = req.user?._id || null;
    bid.deletedipAddress = req.ip;
    bid.userAgent = req.headers['user-agent'] || null;

    await bid.save();

    res.status(200).json({
      success: true,
      message: "Bid deleted successfully",
      data: bid
    });

  } catch (error) {
    console.error("Error deleting bid:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

