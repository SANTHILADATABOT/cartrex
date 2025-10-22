const Space = require('../../models/Space');


exports.getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({ deletstatus: 0 });
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching spaces', error });
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
