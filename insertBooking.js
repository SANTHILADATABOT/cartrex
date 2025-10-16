const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Booking = require('./models/Booking'); // Adjust path if needed

const MONGO_URI = process.env.MONGODB_URI;

async function insertBooking() {
  try {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
       console.log('Connected to MongoDB');
    const bookings = [
      {
        spaceId: '68e7a17079ab7b984ec3ea5b',


        
        shipperId: '68e89697ff69c2c3db3c9fac',
        carrierId: '68e89666930f29d208b23cce',
        truckId: '68e898a37e5ff4cd24b7b4b4',

        vehicleDetails: {
          licenseNumber: 'TX-12345-AB',
          brand: 'Tesla',
          vehicleType: 'Model X',
          yearMade: 2023,
          features: ['Autopilot', 'GPS', 'Heated Seats'],
          condition: 'excellent',
          quantity: 2,
          photos: [
            'https://example.com/photo1.jpg',
            'https://example.com/photo2.jpg'
          ],
          contains100lbs: true
        },

        shippingInfo: {
          whatIsBeingShipped: 'Electric Cars',
          additionalComments: 'Handle with care — high-value shipment'
        },

        pickup: {
          location: '350 Main St, Dallas, TX, USA',
          pickupDate: new Date('2025-10-18'),
          locationType: 'CarDealership'
        },

        delivery: {
          location: '500 Broadway, Los Angeles, CA, USA'
        },

        status: 'pending',
        createdBy: '68e73aebda9fdad99d4d53ea',
        updatedBy: '68e73aebda9fdad99d4d53ea',
        ipAddress: '192.168.1.20',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        deletstatus: 0
      },
      {
        spaceId: '68e8a033a56150607b6b08e9',
        shipperId: '68e89e9ba18edcd100f0f4c6',
        carrierId: '68e89666930f29d208b23ccf',
        truckId: '68e898a37e5ff4cd24b7b4b5',

        vehicleDetails: {
          licenseNumber: 'CA-98765-CD',
          brand: 'Ford',
          vehicleType: 'F-150',
          yearMade: 2021,
          features: ['Bluetooth', 'Backup Camera'],
          condition: 'good',
          quantity: 1,
          photos: ['https://example.com/truck1.jpg'],
          contains100lbs: false
        },

        shippingInfo: {
          whatIsBeingShipped: 'Pickup Truck',
          additionalComments: 'Deliver before noon'
        },

        pickup: {
          location: '100 Market St, San Francisco, CA, USA',
          pickupDate: new Date('2025-10-20'),
          locationType: 'AuctionHouse'
        },

        delivery: {
          location: '200 Sunset Blvd, Los Angeles, CA, USA'
        },

        status: 'confirmed',
        createdBy: '68e73aebda9fdad99d4d53ea',
        updatedBy: '68e73aebda9fdad99d4d53ea',
        ipAddress: '10.0.0.45',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
        deletstatus: 0
      }
    ];

    const result = await Booking.insertMany(bookings);
    console.log('✅ 5 Booking records inserted successfully:\n', result);
    process.exit(0);

  } catch (error) {
    console.error('❌ Error inserting booking data:', error);
    process.exit(1);
  }
}

insertBooking();
