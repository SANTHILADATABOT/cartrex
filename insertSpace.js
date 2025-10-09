const mongoose = require('mongoose');
const Space = require('./models/Space'); // adjust path if needed
const dotenv = require('dotenv');
dotenv.config();
// Replace with your MongoDB connection string
const MONGO_URI = process.env.MONGODB_URI;

async function insertSpace() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Example ObjectIds (replace with valid ones from your Carrier, Truck, Route, User collections)
    const carrierId = new mongoose.Types.ObjectId();
    const truckId = new mongoose.Types.ObjectId();
    const routeId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    // Sample document
    const newSpace = new Space({
      carrierId: carrierId,
      truckId: truckId,
      routeId: routeId,
      origin: {
        location: 'Warehouse A',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pickupDate: new Date('2025-10-10'),
        pickupWindow: '09:00 - 11:00 AM',
        pickupRadius: 15,
        coordinates: {
          type: 'Point',
          coordinates: [80.2707, 13.0827] // [longitude, latitude]
        }
      },
      destination: {
        location: 'Warehouse B',
        city: 'Bangalore',
        state: 'Karnataka',
        deliveryDate: new Date('2025-10-12'),
        deliveryWindow: '02:00 - 04:00 PM',
        deliveryRadius: 20,
        coordinates: {
          type: 'Point',
          coordinates: [77.5946, 12.9716]
        }
      },
      availableSpaces: 5,
      message: 'Refrigerated truck available for goods transport.',
      rateCard: [
        {
          vehicleType: 'Truck',
          basePrice: 12000,
          variants: [
            { name: 'Small', price: 10000 },
            { name: 'Large', price: 15000 }
          ]
        }
      ],
      status: 'active',
      postedDate: new Date(),
      expiryDate: new Date('2025-10-20'),
      createdBy: userId,
      updatedBy: userId,
      ipAddress: '192.168.1.10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    });

    // Save the document
    const result = await newSpace.save();
    console.log('✅ Space inserted successfully:', result);

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error inserting space:', error);
  }
}

insertSpace();
