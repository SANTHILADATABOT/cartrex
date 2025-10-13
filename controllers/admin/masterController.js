const MasterData = require('../../models/MasterVehicleType');
const MasterVehicleType = require('../../models/MasterVehicleType');
const MasterTruckType = require('../../models/MasterTruckType');

// Utility function for audit
function createAudit(userId, ipAddress, userAgent) {
  const now = new Date();
  return {
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
    deletedBy: null,
    deletedAt: null,
    deletstatus: 0,
    ipAddress,
    userAgent
  };
}
exports.createMasterVehicle = async (req, res) => {
  try {
    const { vehicles, status, postedDate, expiryDate } = req.body;

    // Prepare vehicles with audit
    const vehiclesWithAudit = vehicles.map(vehicle => ({
      ...vehicle,
      audit: createAudit(req.user.id, req.ip, req.headers['user-agent']), // main vehicle audit
      sub_categories: vehicle.sub_categories.map(sub => ({
        ...sub,
        deletstatus: 0,   // default deletstatus
        is_active: true,  // default active
        audit: createAudit(req.user.id, req.ip, req.headers['user-agent'])
      }))
    }));

    // Create the document
    const newMasterVehicle = new MasterVehicleType({
      vehicles: vehiclesWithAudit,
      status,
      postedDate,
      expiryDate,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      deletstatus: 0
    });

    const savedDoc = await newMasterVehicle.save();

    res.status(201).json({
      success: true,
      message: 'Master vehicle created successfully',
      data: savedDoc
    });
  } catch (error) {
    console.error('Error creating master vehicle:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
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

exports.createMaster = async (req, res) => {};
exports.getAllMasters = async (req, res) => {
  try {
    // Fetch both collections
    const vehicleTypes = await MasterVehicleType.find({deletstatus: 0});
    const truckTypes = await MasterTruckType.find({ deletstatus: 0, is_active: true });
    const filteredVehicleTypes = vehicleTypes.map(doc => {
      const docObj = doc.toObject();
      return {
        ...docObj,
        vehicles: Array.isArray(docObj.vehicles)
          ? docObj.vehicles
              .filter(vehicle => vehicle.deletstatus === 0 && vehicle.is_active === true) // filter vehicles
              .map(vehicle => ({
                ...vehicle,
                sub_categories: Array.isArray(vehicle.sub_categories)
                  ? vehicle.sub_categories.filter(sub => sub.deletstatus === 0 && sub.is_active === true) // filter sub_categories
                  : []
              }))
          : []
      };
    });
    const filteredTruckTypes = truckTypes.map(truck => ({
      ...truck.toObject(),
      sub_categories: (truck.sub_categories || []).filter(sub => sub.deletstatus !== 1 && sub.is_active === true)
    }));

    // Combine into single response
    const masterData = {
      vehicles: filteredVehicleTypes,
      trucks: filteredTruckTypes
    };

    res.status(200).json({
      success: true,
      message: 'Master data fetched successfully',
      data: masterData
    });
  } catch (error) {
    console.error('Error fetching master data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch master data',
      error: error.message
    });
  }
};

exports.getMasterById = async (req, res) => {}
exports.updateMaster = async (req, res) => {}
exports.deleteMaster = async (req, res) => {}