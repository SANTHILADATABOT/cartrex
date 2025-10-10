// const mongoose = require('mongoose');

// const masterSchema = new mongoose.Schema({
//   // Vehicle master
//   vehicles: [
//     {
//       typeName: { type: String, required: true }, // Sedan, SUV, Truck, etc.
//       capacity: { type: Number, required: true }, // number of spaces or passengers
//       variants: [{ type: String }], // small, mid, high
//       conditions: [{ type: String }] // New, Used, Refurbished, etc.
//     }
//   ],

//   // Locations master
//   locations: [
//     {
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       country: { type: String, default: 'India' } // optional
//     }
//   ],

//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     deletedAt: { type: Date },
//     ipAddress: { type: String },
//     userAgent: { type: String }
// });

// // Optional: indexes for faster lookup
// masterSchema.index({ 'vehicles.typeName': 1 });
// masterSchema.index({ 'locations.city': 1, 'locations.state': 1 });

// module.exports = mongoose.model('MasterData', masterSchema);

const mongoose = require('mongoose');

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
  ipAddress: { type: String },
  userAgent: { type: String }
});

// 2️⃣ Subcategory schema
const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, default: '' },
  is_active: { type: Boolean, default: true },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  display_order: { type: Number, default: 0 },
  audit: { type: auditSchema, required: true }
});

// 3️⃣ Category schema (vehicles/trucks)
const categorySchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  icon_url: { type: String, required: true },
  condition: [{ type: String }],
  capacity: { type: Number, required: true },
  sub_categories: [subCategorySchema],
  is_active: { type: Boolean, default: true },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  display_order: { type: Number, default: 0 },
  audit: { type: auditSchema, required: true }
});

// 4️⃣ Master schema
const masterVehicleTypeSchema = new mongoose.Schema({
  vehicles: [categorySchema],
  status: { type: String, default: 'active' },
  postedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  ipAddress: { type: String },
  userAgent: { type: String }
});

// Export model
module.exports = mongoose.model('masterVehicleTypeSchema', masterVehicleTypeSchema);
