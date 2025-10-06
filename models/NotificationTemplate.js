const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['booking_confirm', 'bid_approved', 'booking_cancel', 'other','payments','job_delivery','job_enroute','deliver_confirmation','ratings_&_reviews','job_pickups'], 
    required: true 
  },

  email: {
    subject: { type: String, trim: true },
    content: { type: String, trim: true }
  },

  sms: {
    subject: { type: String, trim: true }, // optional for SMS
    content: { type: String, trim: true }
  },

  push: {
    content: { type: String, trim: true }
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

module.exports = mongoose.model('NotificationTemplate', notificationSchema);
