const Route = require('../../models/Route');

// ✅ GET all routes (only active ones)
exports.getallroutes = async (req, res) => {
  try {
    const routes = await Route.find({ deletstatus: 0 })
      .populate('carrierId', 'companyName')
      .populate('truckId', 'nickname registrationNumber')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!routes.length) {
      return res.status(200).json({
        success: true,
        message: "No routes found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: routes.length,
      message: "Routes fetched successfully",
      data: routes
    });

  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getroutebyId = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findOne({ _id: routeId, deletstatus: 0 })
      .populate({
        path: 'carrierId',
        select: 'companyName userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('truckId', 'nickname registrationNumber truckType')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .lean();

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found or deleted"
      });
    }

    res.status(200).json({
      success: true,
      message: "Route fetched successfully",
      data: route
    });

  } catch (error) {
    console.error("Error fetching route by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching route details",
      error: error.message
    });
  }
};


// UPDATE route 
exports.updateroute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const updateData = req.body;

    const route = await Route.findOne({ _id: routeId, deletstatus: 0 });
    
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found or deleted" });
    }

    Object.keys(updateData).forEach(f => {
      if (updateData[f] !== undefined) route[f] = updateData[f];
    });

    route.updatedAt = new Date();
    route.updatedBy = req.user?._id || null;

    await route.save();

    res.status(200).json({
      success: true,
      message: "Route updated successfully",
      data: route
    });

  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ SOFT DELETE route (set deletstatus = 1)
exports.deleteroute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findOne({ _id: routeId, deletstatus: 0 });
    if (!route) {
      return res.status(404).json({ success: false, message: "Route not found or already deleted" });
    }

    route.deletstatus = 1;
    route.deletedAt = new Date();
    route.deletedBy = req.user?._id || null;
    route.deletedipAddress = req.ip;

    await route.save();

    res.status(200).json({
      success: true,
      message: "Route deleted successfully",
      data: route
    });

  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
