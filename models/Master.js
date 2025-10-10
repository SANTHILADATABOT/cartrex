const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({
  // Vehicle master
  vehicles: [
    {
      icon:{ type: String},
      typeName: { type: String, required: true }, // Sedan, SUV, Truck, etc.
      variants: [{
        key: { type: String },
        price: { type: Number}
      }]
    }
  ],
  // Truck
  truck: [
    {
      icon:{ type: String},
      typeName: { type: String, required: true }, // Sedan, SUV, Truck, etc.
      // capacity: { type: Number, required: true }, // number of spaces or passengers
      variants: [{ type: String }], // small, mid, high
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
    deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Optional: indexes for faster lookup
masterSchema.index({ 'vehicles.typeName': 1 });
masterSchema.index({ 'locations.city': 1, 'locations.state': 1 });

module.exports = mongoose.model('MasterData', masterSchema);
