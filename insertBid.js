const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Bid = require('./models/Bid'); 

const MONGO_URI = process.env.MONGODB_URI;

async function insertBid() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const bids = [
      {
        shipperId: '68ef9731262301d30943833a',
        carrierId: '68e89666930f29d208b23ccf',
        routeId: '68e8a033a56150607b6b08ea',
        bidValue: 4500,

        vehicleDetails: {
          licenseNumber: 'TX-56789-AB',
          brand: 'Tesla',
          vehicleType: 'Model Y',
          yearMade: 2023,
          features: ['Electric', 'Autopilot', 'Sunroof'],
          condition: 'excellent',
          quantity: 1,
          photos: ['https://example.com/tesla_modely.jpg'],
          contains100lbs: false
        },

        shippingDescription: 'Transporting 1 brand-new Tesla Model Y',
        transportType: 'Enclosed Car Hauler',
        vinNumber: '5YJYGDEE8MF123456',
        lotNumber: 'LOT-2025-001',

        pickup: {
          city: 'Dallas',
          state: 'TX',
          zipcode: '75201',
          pickupDate: new Date('2025-10-20'),
          pickupLocationType: 'CarDealership'
        },

        delivery: {
          city: 'Los Angeles',
          state: 'CA',
          zipcode: '90015'
        },

        additionalComments: 'Please ensure temperature control and soft straps.',
        timing: 'good_till_cancelled',
        status: 'pending',

        createdBy: '68e73aebda9fdad99d4d53ea',
        updatedBy: '68e73aebda9fdad99d4d53ea',
        ipAddress: '192.168.1.25',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        deletstatus: 0
      },
      {
        shipperId: '68e89e9ba18edcd100f0f4c6',  // ✅ fixed here
        carrierId: '68e89666930f29d208b23cce',
        routeId: '68e8a033a56150607b6b08e9',
        bidValue: 5200,

        vehicleDetails: {
          licenseNumber: 'CA-98765-ZY',
          brand: 'Ford',
          vehicleType: 'F-150',
          yearMade: 2022,
          features: ['Tow Package', 'Backup Camera', 'Bluetooth'],
          condition: 'good',
          quantity: 2,
          photos: ['https://example.com/ford_f150.jpg'],
          contains100lbs: true
        },

        shippingDescription: 'Shipment of 2 Ford F-150 trucks',
        transportType: 'Open Car Hauler',
        vinNumber: '1FTFW1E58MKE12345',
        lotNumber: 'LOT-2025-002',

        pickup: {
          city: 'Phoenix',
          state: 'AZ',
          zipcode: '85001',
          pickupDate: new Date('2025-10-22'),
          pickupLocationType: 'AuctionHouse'
        },

        delivery: {
          city: 'Las Vegas',
          state: 'NV',
          zipcode: '89101'
        },

        additionalComments: 'Flexible on delivery time, open truck is fine.',
        timing: '1_week',
        status: 'approved',

        createdBy: '68e73aebda9fdad99d4d53ea',
        updatedBy: '68e73aebda9fdad99d4d53ea',
        ipAddress: '10.0.0.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        deletstatus: 0
      }
    ];

    const result = await Bid.insertMany(bids);
    console.log(`✅ ${result.length} Bid record(s) inserted successfully:\n`, result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting bid data:', error);
    process.exit(1);
  }
}

insertBid();
