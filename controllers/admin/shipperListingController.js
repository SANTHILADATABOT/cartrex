const User = require('../../models/User');
const Shipper = require('../../models/Shipper');


// ✅ GET all shippers (active only)
exports.getallshippers = async (req, res) => {
  try {

    const shipperUsers = await User.find({
      role: "68ff5689aa5d489915b8caaa",
      deletstatus: 0
    });

    if (!shipperUsers.length) {
      return res.status(200).json({ success: true, message: "No shippers found", data: [] });
    }

    const userIds = shipperUsers.map(u => u._id);
    const shippers = await Shipper.find({ userId: { $in: userIds }, deletstatus: 0 });

    const result = shipperUsers.map(user => {
      const shipper = shippers.find(s => s.userId.toString() === user._id.toString());
      return { user, shipper };
    });

    res.status(200).json({
      success: true,
      message: "Shippers fetched successfully",
      data: result
    });

  } catch (error) {
    console.error("Error fetching shippers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateshipper = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

console.log("updateData",updateData );
    const user = await User.findOne({ _id: userId, deletstatus: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or deleted" });
    }


    const shipper = await Shipper.findOne({ userId: userId, deletstatus: 0 });
    if (!shipper) {
      return res.status(404).json({ success: false, message: "Shipper not found or deleted" });
    }


    const userFields = ["firstName", "lastName", "email", "phone"];
    userFields.forEach(f => { if (updateData[f]) user[f] = updateData[f]; });
    user.updatedAt = new Date();
    user.updatedBy = req.user?._id || null;
    await user.save();


    const shipperFields = ["companyName", "dba", "photo", "address", "city", "state", "zipCode", "country", "status"];
    shipperFields.forEach(f => { if (updateData[f] !== undefined) shipper[f] = updateData[f]; });
    shipper.updatedAt = new Date();
    shipper.updatedBy = req.user?._id || null;
    await shipper.save();

    res.status(200).json({
      success: true,
      message: "Shipper and User updated successfully",
      data: { shipper, user }
    });

  } catch (error) {
    console.error("Error updating shipper:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Shipper Status by Shipper ID
exports.updateshipperstatusbyId = async (req, res) => {
  try {
    const { shipperId } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive",
      });
    }
    const shipper = await Shipper.findOne({ _id: shipperId, deletstatus: 0 });
    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Shipper not found or deleted",
      });
    }
    shipper.status = status;
    shipper.updatedAt = new Date();
    shipper.updatedBy = req.user?._id || null;
    await shipper.save();

    res.status(200).json({
      success: true,
      message: `Shipper status updated to ${status}`,
      data: shipper,
    });

  } catch (error) {
    console.error("Error updating shipper status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getshipperbyId = async (req, res) => {
  try {
    const { shipperId } = req.params;

    const shipper = await Shipper.findOne({ _id: shipperId, deletstatus: 0 })
      .populate("userId", "firstName lastName email phone companyname role")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Shipper not found or deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipper details fetched successfully",
      data: shipper,
    });

  } catch (error) {
    console.error("Error fetching shipper by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.deleteshipper = async (req, res) => {
  try {
    const { userId } = req.params;


    const user = await User.findOne({ _id: userId, deletstatus: 0 });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or already deleted" });
    }

    const shipper = await Shipper.findOne({ userId: userId, deletstatus: 0 });
    if (!shipper) {
      return res.status(404).json({ success: false, message: "Shipper not found or already deleted" });
    }


    shipper.deletstatus = 1;
    shipper.deletedAt = new Date();
    shipper.deletedBy = req.user?._id || null;
    await shipper.save();

    user.deletstatus = 1;
    user.deletedAt = new Date();
    user.deletedBy = req.user?._id || null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Shipper and linked user deleted successfully",
      data: { shipper, user }
    });

  } catch (error) {
    console.error("Error deleting shipper:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//Get Shipper By id 
exports.getshipperbyId = async (req, res) => {
  try {
    const { shipperId } = req.params;

    const shipper = await Shipper.findOne({ _id: shipperId, deletstatus: 0 })
      .populate("userId", "firstName lastName email phone companyname role")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

      console.log(shipper)

    if (!shipper) {
      return res.status(404).json({
        success: false,
        message: "Shipper not found or deleted",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipper details fetched successfully",
      data: shipper,
    });

  } catch (error) {
    console.error("Error fetching shipper by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createShipper = async (req, res) => {
  try {
    const data = req.body;
    console.log("req.body => in add shipper", data);

    // 1️⃣ Create and save User
    const userData = new User({
      email: data?.email,
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone: data?.phone,
      role: data?.roleId, // explicitly set to 'shipper'
      isApproved: true,
      isActive: true,
      password: data?.phone, // hash handled by pre-save hook
      audit: { ...data?.audit, deletstatus: 0 },
    });

    const savedUser = await userData.save();
    if (!savedUser) {
      return res.status(400).json({
        success: false,
        message: "Failed to create user.",
      });
    }

    // 2️⃣ Create and save Shipper
    const shipperData = new Shipper({
      userId: savedUser._id,
      companyName: data?.companyName || "",
      dba: data?.dba || "",
      photo: data?.photo || "",
      address: data?.address || "",
      city: data?.city || "",
      state: data?.state || "",
      zipCode: data?.zipcode || "",
      country: data?.country || "",
      status: data?.status || "active",
      createdBy: data?.audit?.createdBy || savedUser._id,
      updatedBy: data?.audit?.updatedBy || savedUser._id,
      ipAddress: data?.audit?.ipAddress || req.ip,
      userAgent: data?.audit?.userAgent || req.headers["user-agent"],
    });

    const savedShipper = await shipperData.save();

    // 3️⃣ Return success response
    return res.status(201).json({
      success: true,
      message: "Shipper and user created successfully.",
      data: {
        user: savedUser,
        shipper: savedShipper,
      },
    });
  } catch (error) {
    console.error("Error in addshipper:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};