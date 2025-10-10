// insertRoute.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Route = require('./models/Route'); // adjust path if needed

const MONGO_URI = process.env.MONGODB_URI;

async function insertRoutes() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Example routes for the two carriers
    const routes = [
      {
        carrierId: '68e89666930f29d208b23cce', // Priya Logistics LLC
        truckId: '68e898a37e5ff4cd24b7b4b4', // replace with an actual Truck ObjectId
        origin: {
          state: 'Georgia',
          city: 'Atlanta',
          pickupWindow: '08:00-12:00',
          pickupRadius: 20
        },
        destination: {
          state: 'Florida',
          city: 'Miami',
          deliveryWindow: '09:00-17:00',
          deliveryRadius: 30
        },
        status: 'active',
        createdBy: '68e73aebda9fdad99d4d53ea', // admin user
        ipAddress: '34.123.56.30',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      {
        carrierId: '68e89666930f29d208b23ccf', // Nivetha Freight Carriers Inc
        truckId: '68e898a37e5ff4cd24b7b4b5', // replace with an actual Truck ObjectId
        origin: {
          state: 'California',
          city: 'Los Angeles',
          pickupWindow: '07:00-11:00',
          pickupRadius: 15
        },
        destination: {
          state: 'Nevada',
          city: 'Las Vegas',
          deliveryWindow: '10:00-18:00',
          deliveryRadius: 25
        },
        status: 'active',
        createdBy: '68e73aebda9fdad99d4d53ea', // admin user
        ipAddress: '34.123.56.31',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    ];

    const result = await Route.insertMany(routes);
    console.log('🛣️ Routes inserted successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting routes:', error);
    process.exit(1);
  }
}

insertRoutes();
