const Route = require('../../models/Route');

// ✅ GET all routes (only active ones)
exports.getallroutes = async (req, res) => {
  try {
    const routes = await Route.find({ deletstatus: 0 })
      // .populate('carrierId', 'companyName')
       .populate({
        path: 'carrierId',
        select: 'companyName userId',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
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
// exports.updateroute = async (req, res) => {
//   try {
//     const { routeId } = req.params;
//     const updateData = req.body;
// console.log("updateData",updateData)
//     const route = await Route.findOne({ _id: routeId, deletstatus: 0 });
//     console.log("updateData-route",route)
//     if (!route) {
//       return res.status(404).json({ success: false, message: "Route not found or deleted" });
//     }

//     Object.keys(updateData).forEach(f => {
//       if (updateData[f] !== undefined) route[f] = updateData[f];
//     });

//     route.updatedAt = new Date();
//     route.updatedBy = req.user?._id || null;

//     await route.save();

//     res.status(200).json({
//       success: true,
//       message: "Route updated successfully",
//       data: route
//     });

//   } catch (error) {
//     console.error("Error updating route:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.updateroute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const updateData = req.body;
    console.log("updateData", updateData);

    const route = await Route.findOne({ _id: routeId, deletstatus: 0 });
    console.log("updateData-route", route);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found or deleted"
      });
    }

    // Update origin and destination fields based on request data
    if (updateData.personalInfo) {
      const info = updateData.personalInfo;

      // Update origin
      route.origin.state = info.origin_state || route.origin.state;
      route.origin.city = info.origin_city || route.origin.city;
      route.origin.pickupWindow = info.pickup_window || route.origin.pickupWindow;
      route.origin.pickupRadius = info.pickup_radius || route.origin.pickupRadius;

      // Update destination
      route.destination.state = info.destination_state || route.destination.state;
      route.destination.city = info.destination_city || route.destination.city;
      route.destination.deliveryWindow = info.delivery_window || route.destination.deliveryWindow;
      route.destination.deliveryRadius = info.delivery_radius || route.destination.deliveryRadius;
    }

    // Update status if provided
    if (updateData.isActive) {
      route.status = updateData.isActive;
    }

    // Update audit info
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
exports.updateStatusRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { status } = req.body; 
    if (!["active", "inactive", "under_maintenance"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive, under_maintenance",
      });
    }

    const truck = await Route.findOne({ _id: routeId, deletstatus: 0 })
      .populate("carrierId", "companyName")
      .populate("truckId", "companyName");

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Route not found or deleted",
      });
    }
    truck.status = status;
    truck.updatedAt = new Date();
    truck.updatedBy = req.user?._id || null;
    await truck.save();

    res.status(200).json({
      success: true,
      message: `Truck status updated to ${status}`,
      data: truck,
    });

  } catch (error) {
    console.error("Error updating truck status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};