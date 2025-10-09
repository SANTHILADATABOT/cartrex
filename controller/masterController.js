const MasterData = require('../models/Master');

// Create or update vehicles
exports.createOrUpdateVehicles = async (req, res) => {
  try {
    const { vehicles, createdBy, ipAddress, userAgent } = req.body;
    if (!vehicles || !Array.isArray(vehicles)) {
      return res.status(400).json({ message: 'vehicles array is required' });
    }
// {
//   "vehicles": [],         // an array for vehicles
//   "truck": {},            // an object for truck details
//   "locations": [],        // an array for location information
//   "createdBy": "string",  // typically a user ID or name
//   "ipAddress": "string",  // optional, client's IP address
//   "userAgent": "string"   // optional, browser or client information
// }

    let master = await MasterData.findOne();
    if (!master) {
      master = new MasterData({ createdBy });
    }

    vehicles.forEach(vehicle => {
      const index = master.vehicles.findIndex(v => v.typeName === vehicle.typeName);
      if (index !== -1) {
        master.vehicles[index].variants = vehicle.variants || master.vehicles[index].variants;
      } else {
        master.vehicles.push(vehicle);
      }
    });

    master.updatedAt = new Date();
    master.updatedBy = createdBy;
    master.ipAddress = ipAddress;
    master.userAgent = userAgent;

    await master.save();

    res.status(200).json(master.vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update trucks
exports.createOrUpdateTruck = async (req, res) => {
  try {
    const { truck, createdBy, ipAddress, userAgent } = req.body;
    if (!truck || !Array.isArray(truck)) {
      return res.status(400).json({ message: 'truck array is required' });
    }

    let master = await MasterData.findOne();
    if (!master) {
      master = new MasterData({ createdBy });
    }

    truck.forEach(t => {
      const index = master.truck.findIndex(trk => trk.typeName === t.typeName);
      if (index !== -1) {
        master.truck[index].variants = t.variants || master.truck[index].variants;
      } else {
        master.truck.push(t);
      }
    });

    master.updatedAt = new Date();
    master.updatedBy = createdBy;
    master.ipAddress = ipAddress;
    master.userAgent = userAgent;

    await master.save();

    res.status(200).json(master.truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create or update locations
exports.createOrUpdateLocations = async (req, res) => {
  try {
    const { locations, createdBy, ipAddress, userAgent } = req.body;
    if (!locations || !Array.isArray(locations)) {
      return res.status(400).json({ message: 'locations array is required' });
    }

    let master = await MasterData.findOne();
    if (!master) {
      master = new MasterData({ createdBy });
    }

    locations.forEach(loc => {
      if (!loc.city || !loc.state) return; // skip invalid location

      const index = master.locations.findIndex(
        l => l.city === loc.city && l.state === loc.state && (loc.country ? l.country === loc.country : true)
      );

      if (index === -1) {
        master.locations.push({
          city: loc.city,
          state: loc.state,
          country: loc.country || 'India'
        });
      }
    });

    master.updatedAt = new Date();
    master.updatedBy = createdBy;
    master.ipAddress = ipAddress;
    master.userAgent = userAgent;

    await master.save();

    res.status(200).json(master.locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
