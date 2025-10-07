// models/EmailTemplate.js
const mongoose = require('mongoose');
const emailTemplateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['booking_confirm', 'bid_approved', 'booking_cancel', 'payment_confirm', 'delivery_confirm', 'account_approval'],
    required: true 
  },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  variables: [String], // e.g., ['{{userName}}', '{{bookingId}}']
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);