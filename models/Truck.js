const mongoose = require('mongoose');
const truckSchema = new mongoose.Schema({
  carrierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier', required: true },
  nickname: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  truckType: { 
    type: String, 
    enum: ['Open Car Hauler', 'Hotshot', 'Enclosed Car Hauler', 'Pickup Truck w/ Trailer', 'Semi Truck W/ Trailer'],
    required: true 
  },
  hasWinch: { type: Boolean, default: false },
  capacity: { type: Number, required: true },
  mcDotNumber: { type: String, required: true },
  vinNumber: { type: String },
  insurance: { type: String }, // S3 URL
  insuranceExpiry: { type: Date, required: true },
  insuranceValidated: { type: Boolean, default: false },
  coverPhoto: { type: String },
  photos: [{ type: String }], // Array of S3 URLs
  rating: { type: Number, default: 0, min: 0, max: 5 },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'under_maintenance'], 
    default: 'active' 
  },
  location: {
    city: String,
    state: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
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

truckSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Truck', truckSchema);
