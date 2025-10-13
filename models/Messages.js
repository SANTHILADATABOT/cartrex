const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },

  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      lastRead: { type: Date, default: null }
    }
  ],

  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      attachments: [String], // URLs or file paths
      sentAt: { type: Date, default: Date.now },
      delivered: { type: Boolean, default: false },
      messageId: { type: String } // optional Twilio SID or other
    }
  ],

  lastMessage: {
    content: { type: String },
    sentAt: { type: Date },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletstatus: {
    type: Number,
    enum: [0, 1],   // Only allow 0 or 1
    default: 0      // Default value is 0
  },
  deletedipAddress: { type: String },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Index for faster lookups by conversation
messageSchema.index({ conversationId: 1 });

module.exports = mongoose.model('Message', messageSchema);
