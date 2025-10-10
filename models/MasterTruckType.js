const mongoose = require('mongoose');
const { subCategorySchema, auditSchema } = require('../models/MasterVehicleType'); 
// Create a commonSchemas.js file if you want to reuse auditSchema and subCategorySchema

const truckTypeSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  icon_url: { type: String, required: true },
  sub_categories: [subCategorySchema],
  is_active: { type: Boolean, default: true },
  display_order: { type: Number, default: 0 },
  audit: { type: auditSchema, required: true }
});

module.exports = mongoose.model('TruckType', truckTypeSchema);
