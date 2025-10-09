const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
  // Vehicle master
  vehicles: [
    {
      category: { type: String, required: true }, // Sedan, SUV, Truck, etc.
      // capacity: { type: Number, required: true }, // number of spaces or passengers
      sub_category: [{ type: String }], // small, mid, high
      icon_url: [{ type: String }], // small, mid, high
      // conditions: [{ type: String }] // New, Used, Refurbished, etc.
    }
  ],

  // Locations master
  locations: [
    {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' } // optional
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Optional: indexes for faster lookup
masterSchema.index({ 'vehicles.typeName': 1 });
masterSchema.index({ 'locations.city': 1, 'locations.state': 1 });

module.exports = mongoose.model('MasterData', masterSchema);
