const AdminRole = require('../../models/AdminRoles');

// GET all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await AdminRole.find({ isActive: true });
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await AdminRole.findById(id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD a new role
exports.addRole = async (req, res) => {
  try {
    const { roleName, roleType, description, permissions, isDefault } = req.body;

    // Optionally check if roleType already exists
    const existingRole = await AdminRole.findOne({ roleType });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'Role type already exists' });
    }

    const newRole = new AdminRole({
      roleName,
      roleType,
      description,
      permissions,
      isDefault: isDefault || false,
      audit: {
        createdBy: req.user._id, // Assuming req.user is set by auth middleware
        updatedBy: req.user._id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await newRole.save();
    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, description, permissions, isActive } = req.body;

    const role = await AdminRole.findById(id);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

    role.roleName = roleName || role.roleName;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;
    if (isActive !== undefined) role.isActive = isActive;

    role.audit.updatedBy = req.user._id;
    role.audit.updatedAt = new Date();
    role.audit.ipAddress = req.ip;
    role.audit.userAgent = req.get('User-Agent');

    await role.save();
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE role (soft delete)
exports.deleteRole = async (req, res) => {
  try {
    const { roleid } = req.params;
console.log('roleid',roleid);
    const role = await AdminRole.findById(roleid);
    if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

    role.isActive = false;
    role.audit.deletstatus = 1;
    role.audit.deletedAt = new Date();
    // role.audit.deletedBy = req.user._id;
    role.audit.deletedipAddress = req.ip;

    await role.save();
    res.status(200).json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
