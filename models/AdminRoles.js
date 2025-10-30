// models/AdminRole.js
const mongoose = require('mongoose');

// Audit Schema
const auditSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  deletedipAddress: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
});

// AdminRole Schema
const adminRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    trim: true
  },
  roleType: {
    type: String,
    required: true,
    // enum: ['super_admin', 'admin', 'manager', 'data_entry', 'accounts', 'moderator', 'support', 'operations','carrier','shipper'],
    unique: true
  },
  description: {
    type: String,
    required: false
  },
  permissions: {
    dashboard: { view: { type: Boolean, default: false }, export: { type: Boolean, default: false } },
    homepageSettings: { view: { type: Boolean, default: false }, edit: { type: Boolean, default: false } },
    emailSmsNotifications: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    masters: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    manageUsers: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    manageBookings: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }, approve: { type: Boolean, default: false } },
    manageShippers: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }, approve: { type: Boolean, default: false } },
    manageCarriers: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }, approve: { type: Boolean, default: false } },
    manageTrucks: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    manageRoutes: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    manageSpaces: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    manageBids: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }, approve: { type: Boolean, default: false } },
    managePayments: { view: { type: Boolean, default: false }, process_refund: { type: Boolean, default: false }, export: { type: Boolean, default: false } },
    reportsAnalytics: { view: { type: Boolean, default: false }, export: { type: Boolean, default: false } },
    shipmentsHistory: { view: { type: Boolean, default: false }, export: { type: Boolean, default: false } },
    complaintsDisputes: { view: { type: Boolean, default: false }, create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }, resolve: { type: Boolean, default: false } },
    systemSettings: { view: { type: Boolean, default: false }, edit: { type: Boolean, default: false } }
  },
  isDefault: { type: Boolean, default: false },
 isActive: {
  type: String,enum: ["active", "inactive"],default: "active"
},
  audit: { type: auditSchema, required: true } // embedding audit schema
}, {
  timestamps: true
});

// Indexes
adminRoleSchema.index({ roleType: 1 });
adminRoleSchema.index({ isActive: 1 });

// Static method to get default role
adminRoleSchema.statics.getDefaultRole = function() {
  return this.findOne({ isDefault: true });
};

// Static method to get role by type
adminRoleSchema.statics.getByRoleType = function(roleType) {
  return this.findOne({ roleType, isActive: true });
};

module.exports = mongoose.model('AdminRole', adminRoleSchema);
