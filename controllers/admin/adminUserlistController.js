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


// Get Admin User by Id 
exports.getadminuserbyid = async (req, res) => {
  try {
    const { adminid } = req.params;

    // Fetch only needed fields
    const adminUser = await AdminUser.findOne({ _id: adminid, 'audit.deletstatus': 0 })
      .select('personalInfo.firstName personalInfo.lastName personalInfo.email roleType isActive');

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found or deleted',
      });
    }

    // Format the response
    const responseData = {
      firstName: adminUser.personalInfo?.firstName || '',
      lastName: adminUser.personalInfo?.lastName || '',
      email: adminUser.personalInfo?.email || '',
      role: adminUser.roleType || '',
      status: adminUser.isActive ? 'Active' : 'Inactive',
    };

    res.status(200).json({
      success: true,
      data: responseData,
    });

  } catch (err) {
    console.error('Error fetching admin user:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
