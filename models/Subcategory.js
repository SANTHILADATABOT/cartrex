const mongoose = require('mongoose');


const auditSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date },
  deleteStatus: { type: Number, enum: [0, 1], default: 0 },
  deletedIpAddress: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
});

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 },
  deleteStatus: { type: Number, enum: [0, 1], default: 0 },
  deletedIpAddress: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
 
  audit: { type: auditSchema, default: () => ({}) }, 
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
