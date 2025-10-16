const Truck = require('../../models/Truck');



// GET all trucks 


exports.getalltrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ deletstatus: 0 })
      .populate('carrierId', 'companyName');

    if (!trucks.length) {
      return res.status(200).json({
        success: true,
        message: "No trucks found",
        data: []
      });
    }

    
    return res.status(200).json({
      success: true,
      message: "Trucks fetched successfully",
      data: trucks
    });

  } catch (error) {
    console.error("Error fetching trucks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






// UPDATE truck 
exports.updatetruck = async (req, res) => {
  try {
    const { truckId } = req.params;
    const updateData = req.body;

    const truck = await Truck.findOne({ _id: truckId, deletstatus: 0 });
    if (!truck) {
      return res.status(404).json({ success: false, message: "Truck not found or deleted" });
    }

    Object.keys(updateData).forEach(f => {
      if (updateData[f] !== undefined) truck[f] = updateData[f];
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


//  DELETE truck 
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
