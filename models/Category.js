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

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  icon_url: { type: String },
  condition: [{ type: String }],
  capacity: { type: Number },
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 },
  deleteStatus: { type: Number, enum: [0, 1], default: 0 },
  
  audit: { type: auditSchema, default: () => ({}) },
}, { timestamps: true });


categorySchema.virtual('subcategories', {
  ref: 'SubCategory',
  localField: '_id',
  foreignField: 'category',
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
