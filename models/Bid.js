const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  shipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipper', required: true },
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },

  bidValue: { type: Number, required: true },

  vehicleDetails: {
    licenseNumber: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    vehicleType: { type: String, required: true, trim: true },
    yearMade: { type: Number },
    features: [String], // Array of features
    condition: { type: String, enum: ['new', 'used', 'excellent', 'good', 'fair', 'poor'], default: 'good' },
    quantity: { type: Number, default: 1 },
    photos: [String], // store image URLs or file paths
    contains100lbs: { type: Boolean, default: false }
  },

  shippingDescription: { type: String, trim: true }, // "What are you shipping?"
  transportType: { type: String, trim: true },
  vinNumber: { type: String, trim: true },
  lotNumber: { type: String, trim: true },

  pickup: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupLocationType: { type: String, trim: true }
  },

  delivery: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true }
  },

  additionalComments: { type: String },

  timing: { 
    type: String, 
    enum: ['good_till_cancelled', '1_week'], 
    default: 'good_till_cancelled' 
  },

  status: { 
    type: String, 
    enum: ['pending', 'approved', 'expired'], 
    default: 'pending' 
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Index for faster queries (example: find bids for a shipment)
bidSchema.index({ shipmentId: 1, carrierId: 1 });

module.exports = mongoose.model('Bid', bidSchema);
