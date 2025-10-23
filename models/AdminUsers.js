// models/AdminUser.js
const mongoose = require('mongoose');

// Audit Schema
const auditSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser'},
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  deletedAt: { type: Date },
  deletstatus: {
    type: Number,
    enum: [0, 1], // Only allow 0 or 1
    default: 0
  },
  deletedipAddress: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
});

const adminUserSchema = new mongoose.Schema({
  // adminId: { type: String, required: true, unique: true, trim: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true }, 
    profileImage: { type: String, default: null },
    department: { 
      type: String, 
      enum: ['operations', 'finance', 'customer_support', 'technical', 'marketing', ' '],
      // required: true 
    }
  },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminRole', 
    // required: true 
    },
  roleType: {
    type: String,
    // required: true,
    enum: ['super_admin', 'admin', 'manager', 'data_entry', 'accounts', 'moderator', 'support', 'operations']
  },
  // employment: {
  //   employeeId: { type: String, required: true, unique: true, trim: true },
  //   hireDate: { type: Date, required: true },
  //   position: { type: String, required: true, trim: true },
  //   reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', default: null },
  //   employmentStatus: { type: String, enum: ['active', 'probation', 'suspended', 'terminated', 'resigned'], default: 'active' }
  // },
  isActive: { type: Boolean, default: true },
  isSuperAdmin: { type: Boolean, default: false },
  lastActive: { type: Date, default: null },
  audit: { type: auditSchema, required: true } // embedding audit schema
}, {
  timestamps: true
});

// Indexes
// adminUserSchema.index({ adminId: 1 });
// adminUserSchema.index({ userId: 1 });
adminUserSchema.index({ roleId: 1 });
adminUserSchema.index({ roleType: 1 });
// adminUserSchema.index({ 'personalInfo.department': 1 });
adminUserSchema.index({ isActive: 1 });
// adminUserSchema.index({ 'employment.employmentStatus': 1 });
adminUserSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });

// Virtual for full name
adminUserSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Instance methods
adminUserSchema.methods.hasPermission = function(module, action) {
  if (this.isSuperAdmin) return true;

  return this.populate('roleId').then(admin => {
    const role = admin.roleId;
    if (!role || !role.permissions[module]) return false;
    return role.permissions[module][action] === true;
  });
};

adminUserSchema.methods.canAccessModule = function(module) {
  if (this.isSuperAdmin) return true;

  return this.populate('roleId').then(admin => {
    const role = admin.roleId;
    if (!role || !role.permissions[module]) return false;
    return Object.values(role.permissions[module]).some(permission => permission === true);
  });
};

// Static methods
adminUserSchema.statics.findByDepartment = function(department) {
  return this.find({ 'personalInfo.department': department, isActive: true }).populate('roleId');
};

adminUserSchema.statics.findByRoleType = function(roleType) {
  return this.find({ roleType, isActive: true }).populate('roleId');
};

// Pre-save middleware to generate adminId if not provided
adminUserSchema.pre('save', async function(next) {
  if (!this.adminId) {
    const count = await mongoose.model('AdminUser').countDocuments();
    this.adminId = `ADM-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
