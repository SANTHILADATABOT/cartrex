const mongoose = require('mongoose');
const spaceSchema = new mongoose.Schema({
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },
  truckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  origin: {
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupWindow: { type: String, required: true },
    pickupRadius: { type: Number, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    }
  },
  destination: {
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    deliveryDate: { type: Date, required: true },
    deliveryWindow: { type: String, required: true },
    deliveryRadius: { type: Number, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number]
    }
  },
  availableSpaces: { type: Number, required: true, min: 1, max: 9 },
  bookedSpaces: { type: Number, default: 0 },
  rateCard: [{
    vehicleType: { type: String, required: true },
    basePrice: { type: Number, required: true },
    variants: [{
      name: { type: String },
      price: { type: Number }
    }]
  }],
  status: { type: String, enum: ['active', 'booked', 'expired'], default: 'active' },
  postedDate: { type: Date, default: Date.now },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

spaceSchema.index({ 'origin.coordinates': '2dsphere' });
spaceSchema.index({ 'destination.coordinates': '2dsphere' });

module.exports = mongoose.model('Space', spaceSchema);