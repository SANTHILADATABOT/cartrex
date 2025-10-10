const mongoose = require('mongoose');
const paymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['card', 'bank'], required: true },
  
  // Card details
  cardNumber: String, // Last 4 digits only
  expiryMonth: Number,
  expiryYear: Number,
  cardBrand: String,
  
  // Bank details
  accountNumber: String, // Encrypted/masked
  routingNumber: String,
  swiftCode: String,
  bankName: String,
  
  // Address
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  
  stripePaymentMethodId: String,
  isDefault: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
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

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);