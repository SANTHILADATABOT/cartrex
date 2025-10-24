const User = require('../../models/User');
const Carrier = require('../../models/Carrier');
const mongoose = require("mongoose");


//Get All Carrier from User and Carrier

exports.getallcarriers = async (req, res) => {
  try {
  
    const carrierUsers = await User.find({ 
      role: "carrier", 
    deletstatus: 0 
    });

    if (!carrierUsers.length) {
      return res.status(200).json({
        success: true,
        message: "No active carrier users found",
        data: [],
      });
    }

    const carrierUserIds = carrierUsers.map(user => user._id.toString());

    const matchedCarriers = await Carrier.find({ 
      userId: { $in: carrierUserIds },
       deletstatus: 0
    })
    .populate("userId", "firstName lastName email phone role")
    .populate("createdBy", "firstName lastName email")
    .populate("updatedBy", "firstName lastName email");

    res.status(200).json({
      success: true,
      count: matchedCarriers.length,
      data: matchedCarriers,
    });

  } catch (error) {
    console.error("Error in getAllCarriers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//Update Carrier from User and Carrier


exports.updatecarrier = async (req, res) => {
  try {
    const { userId } = req.params; 
    const updateData = req.body;

   
    const user = await User.findOne({ _id: userId, deletstatus: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or deleted" });
    }

    const carrier = await Carrier.findOne({ userId: userId, deletstatus: 0 });
    if (!carrier) {
      return res.status(404).json({ success: false, message: "Carrier not found or deleted" });
    }

    const userFields = ["firstName", "lastName", "email", "phone"];
    userFields.forEach(f => { if (updateData[f]) user[f] = updateData[f]; });
    user.updatedAt = new Date();
    user.updatedBy = req.user?._id || null;
    await user.save();

    const carrierFields = ["companyName", "photo", "address", "city", "state", "zipCode", "country", "status"];
    carrierFields.forEach(f => { if (updateData[f] !== undefined) carrier[f] = updateData[f]; });
    carrier.updatedAt = new Date();
    carrier.updatedBy = req.user?._id || null;
    await carrier.save();

    res.status(200).json({
      success: true,
      message: "Carrier and User updated successfully",
      data: { carrier, user }
    });

  } catch (error) {
    console.error("Error updating carrier:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Carrier Status by Carrier ID
exports.updateCarrierStatusById = async (req, res) => {
  try {
    const { carrierId } = req.params;
    const { status } = req.body; // expected "active" or "inactive"

    // Validate input
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive",
      });
    }

    // Find carrier
    const carrier = await Carrier.findOne({ _id: carrierId, deletstatus: 0 });
    if (!carrier) {
      return res.status(404).json({
        success: false,
        message: "Carrier not found or deleted",
      });
    }

    // Update status
    carrier.status = status;
    carrier.updatedAt = new Date();
    carrier.updatedBy = req.user?._id || null;
    await carrier.save();

    res.status(200).json({
      success: true,
      message: `Carrier status updated to ${status}`,
      data: carrier,
    });

  } catch (error) {
    console.error("Error updating carrier status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




//Delete Carrier from User and Carrier


exports.deletecarrier = async (req, res) => {
  try {
    const { userId } = req.params; 

    // Find user
    const user = await User.findOne({ _id: userId, deletstatus: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or already deleted" });
    }

    // Find carrier linked to user
    const carrier = await Carrier.findOne({ userId: userId, deletstatus: 0 });
    if (!carrier) {
      return res.status(404).json({ success: false, message: "Carrier not found or already deleted" });
    }

    carrier.deletstatus = 1;
    carrier.deletedAt = new Date();
    carrier.deletedBy = req.user?._id || null;
    await carrier.save();

    user.deletstatus = 1;
    user.deletedAt = new Date();
    user.deletedBy = req.user?._id || null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Carrier and linked user deleted successfully",
      data: { carrier, user }
    });

  } catch (error) {
    console.error("Error deleting carrier:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};










