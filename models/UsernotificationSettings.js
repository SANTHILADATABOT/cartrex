const mongoose = require('mongoose');
const userNotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  preferences: [
    {
      category: { 
        type: String, 
        enum: ['booking_confirm', 'bid_approved', 'booking_cancel', 'other','payments','job_delivery','job_enroute','deliver_confirmation','ratings_&_reviews','job_pickups'], 
        required: true 
      },
      methods: [{ type: String, enum: ['email', 'sms', 'push'] }] // user-selected delivery channels
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Optional: index for faster lookup
userNotificationSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('UserNotificationSettings', userNotificationSchema);