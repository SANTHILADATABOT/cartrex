const Truck = require('../../models/Truck');



// ✅ GET all trucks (only active ones)
exports.getalltrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ deletstatus: 0 })
      .populate({
        path: "carrierId",
        select: "companyName address city state zipCode country status userId",
        populate: {
          path: "userId",
          select: "firstName lastName email"
        }
      })
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!trucks.length) {
      return res.status(200).json({
        success: true,
        message: "No trucks found",
        data: []
      });
    }
    // ✅ Add ownerName for each truck
    const formattedTrucks = trucks.map(truck => {
      const owner = truck?.carrierId?.userId;
      const ownerName = owner
        ? `${owner?.firstName || ""} ${owner?.lastName || ""}`.trim()
        : null;

      // Convert mongoose doc to plain object so we can add fields
      const truckObj = truck.toObject();
      truckObj.ownerName = ownerName;

      return truckObj;
    });
    return res.status(200).json({
      success: true,
      message: "Trucks fetched successfully",
      data: formattedTrucks
    });

  } catch (error) {
    console.error("Error fetching trucks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// ✅ UPDATE truck (only if not deleted)
exports.updatetruck = async (req, res) => {
  try {
    const { truckId } = req.params;
    const updateData = req.body;

    const truck = await Truck.findOne({ _id: truckId, deletstatus: 0 });
    if (!truck) {
      return res.status(404).json({ success: false, message: "Truck not found or deleted" });
    }

    // ✅ If location is passed as a string, update only the state field
    if (updateData.location && typeof updateData.location === "string") {
      const newState = updateData.location;
      console.log("Updating state inside location =>", newState);

      // ensure location object exists
      if (!truck.location) {
        truck.location = {
          city: "",
          state: "",
          coordinates: {
            type: "Point",
            coordinates: [0, 0]
          }
        };
      }

      truck.location.state = newState;
    }

    // ✅ If location is passed as an object, update its nested fields
    else if (updateData.location && typeof updateData.location === "object") {
      const newLoc = updateData.location;
      if (newLoc.city !== undefined) truck.location.city = newLoc.city;
      if (newLoc.state !== undefined) truck.location.state = newLoc.state;
      if (newLoc.coordinates !== undefined) truck.location.coordinates = newLoc.coordinates;
    }

    // ✅ Update other fields normally
    Object.keys(updateData).forEach(f => {
      if (f !== "location" && updateData[f] !== undefined) {
        truck[f] = updateData[f];
      }
    });

    truck.updatedAt = new Date();
    truck.updatedBy = req.user?._id || null;

    await truck.save();

    res.status(200).json({
      success: true,
      message: "Truck updated successfully",
      data: truck
    });

  } catch (error) {
    console.error("Error updating truck:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Update Truck Status by Truck ID
exports.updatetruckstatusbyId = async (req, res) => {
  try {
    const { truckId } = req.params;
    const { status } = req.body; 
    if (!["active", "inactive", "under_maintenance"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive, under_maintenance",
      });
    }

    const truck = await Truck.findOne({ _id: truckId, deletstatus: 0 })
      .populate("carrierId", "companyName");

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found or deleted",
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

// ✅ GET truck by ID (for edit)
exports.gettruckbyId = async (req, res) => {
  try {
    const { truckId } = req.params;

    const truck = await Truck.findOne({ _id: truckId, deletstatus: 0 })
   .populate({
        path: "carrierId",
        select: "companyName address city state zipCode country status userId",
        populate: {
          path: "userId",
          select: "firstName lastName email"
        }
      })
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck not found or deleted",
      });
    }

    const owner = truck?.carrierId?.userId;
    const ownerName = owner ? `${owner?.firstName} ${owner?.lastName}` : null;

    res.status(200).json({
      success: true,
      message: "Truck details fetched successfully",
      data: {
        ...truck.toObject(),
        ownerName,
      },
    });

  } catch (error) {
    console.error("Error fetching truck by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ SOFT DELETE truck (set deletstatus = 1)
exports.deletetruck = async (req, res) => {
  try {
    const { truckId } = req.params;

    const truck = await Truck.findOne({ _id: truckId, deletstatus: 0 });
    if (!truck) {
      return res.status(404).json({ success: false, message: "Truck not found or already deleted" });
    }

    truck.deletstatus = 1;
    truck.deletedAt = new Date();
    truck.deletedBy = req.user?._id || null;

    await truck.save();

    res.status(200).json({
      success: true,
      message: "Truck deleted successfully ",
      data: truck
    });
  } catch (error) {
    console.error("Error deleting truck:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
