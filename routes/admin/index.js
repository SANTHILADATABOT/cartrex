const express = require('express');
const router = express.Router();

// Import admin routes
const adminRoutes = require('./adminRoutes');        // User management, dashboard
const masterRoutes = require('./masterRoutes');      // Master data

// Use routes with proper prefixes (remove duplicate /admin)
router.use('/', adminRoutes);           // → /admin/api/*
router.use('/masters', masterRoutes);   // → /admin/api/masters/*

module.exports = router;