const mongoose = require('mongoose');
// const { subCategorySchema, auditSchema } = require('../models/MasterVehicleType'); 
// Create a commonSchemas.js file if you want to reuse auditSchema and subCategorySchema
// 1️⃣ Audit schema (reusable)
const auditSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  deletedipAddress: { type: String },
  display_order: { type: Number, default: 0 },
  audit: { type: auditSchema, required: true }
});
const truckTypeSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  icon_url: { type: String, required: true },
  sub_categories: [subCategorySchema],
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  deletedipAddress: { type: String },
  audit: { type: auditSchema, required: true }
});

module.exports = mongoose.model('TruckType', truckTypeSchema);
