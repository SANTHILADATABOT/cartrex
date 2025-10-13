const mongoose = require('mongoose');

const keysSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },

  logos: {
    appLogo: { type: String, trim: true },    // S3 URL
    favicon: { type: String, trim: true }     // S3 URL
  },

  footer: {
    footerText: { type: String, trim: true },
    links: [String]                            // Array of URLs or text
  },

  keys: {
    stripe: {
      publicKey: { type: String, trim: true },
      secretKey: { type: String, trim: true }
    },
    sendGrid: {
      apiKey: { type: String, trim: true }
    },
    twilio: {
      accountSid: { type: String, trim: true },
      authToken: { type: String, trim: true },
      fromNumber: { type: String, trim: true }
    },
    firebase: {
      apiKey: { type: String, trim: true },
      authDomain: { type: String, trim: true },
      projectId: { type: String, trim: true },
      storageBucket: { type: String, trim: true },
      messagingSenderId: { type: String, trim: true },
      appId: { type: String, trim: true }
    },
    googleMaps: {
      apiKey: { type: String, trim: true }
    }
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
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    deletedipAddress: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String }
});

// Index if you need to query by projectName
keysSchema.index({ projectName: 1 }, { unique: true });

module.exports = mongoose.model('Keys', keysSchema);
