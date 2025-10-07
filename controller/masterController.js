const MasterData = require('../models/Master');

// Create new master data document
exports.createMaster = async (req, res) => {
  try {
    const master = new MasterData({
      vehicles: req.body.vehicles,
      locations: req.body.locations,
      createdBy: req.user._id, // assuming user id comes from authenticated req.user
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    await master.save();
    res.status(201).json({ message: 'Master data created', master });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all master data documents
exports.getAllMasters = async (req, res) => {
  try {
    const masters = await MasterData.find({});
    res.status(200).json(masters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single master by ID
exports.getMasterById = async (req, res) => {
  try {
    const master = await MasterData.findById(req.params.id);
    if (!master) return res.status(404).json({ message: 'Master data not found' });
    res.status(200).json(master);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update master data by ID
exports.updateMaster = async (req, res) => {
  try {
    const updateData = {
      vehicles: req.body.vehicles,
      locations: req.body.locations,
      updatedBy: req.user._id,
      updatedAt: Date.now(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };
    const master = await MasterData.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!master) return res.status(404).json({ message: 'Master data not found' });
    res.status(200).json({ message: 'Master data updated', master });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Soft delete master data by ID
exports.deleteMaster = async (req, res) => {
  try {
    const updateData = {
      deletedBy: req.user._id,
      deletedAt: Date.now(),
      updatedAt: Date.now()
    };
    const master = await MasterData.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!master) return res.status(404).json({ message: 'Master data not found' });
    res.status(200).json({ message: 'Master data soft deleted', master });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
