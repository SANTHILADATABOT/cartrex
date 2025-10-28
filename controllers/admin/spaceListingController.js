const mongoose = require('mongoose');
const Space = require('../../models/Space');
const Truck = require('../../models/Truck');


// exports.getAllSpaces = async (req, res) => {
//   try {
//     const spaces = await Space.find({ deletstatus: 0 })
//       // 🟢 Populate carrier details
//       //.populate('carrierId','userId companyName noOfTrucks')
//        .populate({
//         path: 'carrierId',
//         select: 'userId companyName noOfTrucks', 
//         populate: {
//           path: 'userId',
//           select: 'firstName lastName ', 
//         },
//       })
//        .populate( 'truckId', 'carrierId nickname truckType registrationNumber location')
//         .populate('routeId','origin.state destination.state');
//     res.status(200).json({
//       sucess: "true",
//       message: "All Spaces Fetched Sucessfully",
//       data: spaces,
//     });
//   } catch (error) {
//     console.error("Error fetching spaces:", error);
//     res.status(500).json({
//       message: "Error fetching spaces",
//       error: error.message,
//     });
//   }
// };

exports.getAllSpaces = async (req, res) => {
  try {
    let spaces = await Space.find({ deletstatus: 0 })
       .populate({
        path: 'carrierId',
        select: 'userId companyName ', 
        populate: {
          path: 'userId',
          select: 'firstName lastName ', 
        },
      })
    .populate('truckId',' carrierId nickname truckType registrationNumber rating location')
    .populate('routeId')
     
    .lean(); 
    const carrierIds = [...new Set(spaces.map(s => s.carrierId?._id?.toString()).filter(Boolean))];

    const truckCounts = await Truck.aggregate([
      { $match: { carrierId: { $in: carrierIds.map(id => new mongoose.Types.ObjectId(id)) }, deletstatus: 0 } },
      { $group: { _id: "$carrierId", totalTrucks: { $sum: 1 } } },
    ]);

    const truckCountMap = {};
    truckCounts.forEach(tc => {
      truckCountMap[tc._id.toString()] = tc.totalTrucks;
    });
    spaces = spaces.map(space => {
      if (space.carrierId && space.carrierId._id) {
        space.carrierId.noOfTrucks = truckCountMap[space.carrierId._id.toString()] || 0;
      }
      return space;
    });
    res.status(200).json({
      sucess: "true",
      message: "All Spaces Fetched Sucessfully",
      data: spaces,
    });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    res.status(500).json({
      message: "Error fetching spaces",
      error: error.message,
    });
  }
};


exports.getspacebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const space = await Space.findById(id)
      .populate({
        path: 'carrierId',
        select: 'userId companyName noOfTrucks',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .populate('truckId', 'carrierId nickname truckType registrationNumber location rating status')
      .populate('routeId')
      .populate('createdBy', 'firstName lastName email') 
      .populate('updatedBy', 'firstName lastName email')
      .lean();

    if (!space) {
      return res.status(404).json({
        success: false,
        message: "Space not found"
      });
    }
   // Add truck count logic (like getAllSpaces)
    if (space.carrierId && space.carrierId._id) {
      const carrierId = space.carrierId._id;

      const truckCount = await Truck.countDocuments({
        carrierId: carrierId,
        deletstatus: 0
      });

      // Add count to carrier details
      space.carrierId.noOfTrucks = truckCount;
    }
    res.status(200).json({
      success: true,
      message: "Space details fetched successfully",
      data: space
    });

  } catch (error) {
    console.error("Error fetching space by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching space details",
      error: error.message
    });
  }
};



exports.updateSpaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.status && !['active', 'booked', 'expired'].includes(updateData.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

 
    const auditFields = {
      ...updateData, 
      updatedAt: new Date(),
      updatedBy: updateData.updatedBy,
      updated_ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };

    const updatedSpace = await Space.findByIdAndUpdate(id, auditFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedSpace)
      return res.status(404).json({ message: 'Space not found' });

    res.status(200).json({
      message: 'Space updated successfully',
      updatedSpace,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: 'Error updating space',
      error: error.message,
    });
  }
};
exports.updatespace = async (req, res) => {
  try {
    const { spaceid } = req.params;
    const updateData = req.body;
    if (updateData.status && !['active', 'booked', 'expired'].includes(updateData.status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const auditFields = {
      ...updateData, 
      updatedAt: new Date(),
      updatedBy: updateData?.updatedBy,
      updated_ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
    };

    const updatedSpace = await Space.findByIdAndUpdate(spaceid, auditFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedSpace)
      return res.status(404).json({ message: 'Space not found' });

    res.status(200).json({
      success: true,
      message: 'Space updated successfully',
      updatedSpace,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating space',
      error: error.message,
    });
  }
};


exports.DeleteSpace = async (req, res) => {
  try {
    const { id } = req.params;
    // const { deletedBy } = req.body; // take from body

    // if (!deletedBy) {
    //   return res.status(400).json({ message: "deletedBy is required" });
    // }

    const auditFields = {
      deletstatus: 1,
      deletedAt: new Date(),
      //deletedBy,//req.ip || req.connection.remoteAddress,
      deleted_ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      updatedAt: new Date(),
      //updatedBy: deletedBy,
    };

    const deletedSpace = await Space.findByIdAndUpdate(id, auditFields, {
      new: true,
      runValidators: true,
    });

    if (!deletedSpace)
      return res.status(404).json({ message: "Space not found" });

    res.status(200).json({
      message: "Space deleted successfully",
      deletedSpace,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      message: "Error deleting space",
      error: error.message,
    });
  }
};
