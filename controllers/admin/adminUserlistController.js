const AdminUser = require('../../models/AdminUsers');
const mongoose = require('mongoose');



// CREATE Admin User
exports.createadminuser = async (req, res) => {
  try {
    const { personalInfo =null, roleId = null, roleType = null, isActive = true, isSuperAdmin = false, audit } = req.body;
    console.log(' req.body=> ',req.body);
    const adminUser = new AdminUser({
      personalInfo,
      roleId,
      roleType,
      isActive,
      isSuperAdmin,
      audit: { ...audit, deletstatus: 0 }
    });

    await adminUser.save();
    res.status(201).json({ success: true, data: adminUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET ALL Admin Users 
exports.getalladminusers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find({ 'audit.deletstatus': 0 })
      .populate('roleId')
      .populate('personalInfo.firstName personalInfo.lastName')
      .populate('audit.createdBy', 'personalInfo.firstName personalInfo.lastName')
      .populate('audit.updatedBy', 'personalInfo.firstName personalInfo.lastName');

    res.status(200).json({ success: true, data: adminUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};



//UPDATE Admin User
exports.updateadminuser = async (req, res) => {
  try {
    const { adminid } = req.params;
    const updateData = req.body;

    const adminUser = await AdminUser.findOne({ _id: adminid, 'audit.deletstatus': 0 });
    if (!adminUser) return res.status(404).json({ success: false, message: 'Admin user not found or deleted' });

    for (const key in updateData) {
      if (updateData.hasOwnProperty(key)) {
        adminUser[key] = updateData[key];
      }
    }
  
    await adminUser.save();
    res.status(200).json({ success: true, data: adminUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ UPDATE Admin User Active Status
exports.updateadminuserstatus = async (req, res) => {
  try {
    const { adminid } = req.params;
    const { isActive } = req.body;

    if (!["active", "inactive"].includes(isActive))  {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive"
      });
    }

    const adminUser = await AdminUser.findOne({ _id: adminid, 'audit.deletstatus': 0 });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found or deleted.'
      });
    }

    adminUser.isActive = isActive;
    adminUser.audit.updatedAt = new Date();
    adminUser.audit.updatedBy = req.user?._id || null; // optional if auth middleware is added

    await adminUser.save();

    res.status(200).json({
      success: true,
      message: `Admin user has been ${isActive ? 'activated' : 'deactivated'} successfully.`,
      data: adminUser
    });

  } catch (err) {
    console.error("Error updating admin user status:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


//  DELETE Admin User 
exports.deleteadminuser = async (req, res) => {
  try {
    const { adminid } = req.params;
    console.log('adminid=>',adminid)

    const adminUser = await AdminUser.findOne({ _id: adminid, 'audit.deletstatus': 0 });
    if (!adminUser) return res.status(404).json({ success: false, message: 'Admin user not found or already deleted' });

    adminUser.isActive = false;
    if (adminUser.audit) {
      adminUser.audit.deletstatus = 1;
      adminUser.audit.deletedAt = new Date();
    }

    await adminUser.save();
    res.status(200).json({ success: true, message: 'Admin user deleted ' , data:adminUser});
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
