const User = require('../../models/User');
const Shipper = require('../../models/Shipper');
const Carrier = require('../../models/Carrier');
const Truck = require('../../models/Truck');
const Booking = require('../../models/Booking');
const Payment = require('../../models/Payment');
const Complaint = require('../../models/Complaint');

exports.getDashboard = async (req, res) => {
  try {
    const totalShippers = await Shipper.countDocuments();
    const totalCarriers = await Carrier.countDocuments();
    const totalTrucks = await Truck.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Carrier.countDocuments({ status: 'pending' });

    const bookingsChart = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: { totalShippers, totalCarriers, totalTrucks, totalBookings, pendingApprovals, bookingsChart }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: adminUsers });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });

    const user = await User.create({ email, password, firstName, lastName, phone, role: 'admin', isApproved: true, isActive: true });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    console.error('Create admin user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateAdminUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'admin') return res.status(404).json({ success: false, message: 'Admin user not found' });

    Object.assign(user, req.body);
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Update admin user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.bookingId = { $regex: search, $options: 'i' };

    const bookings = await Booking.find(query)
      .populate('shipperId carrierId truckId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const totalShipments = await Booking.countDocuments({ ...dateFilter, status: 'completed' });

    const revenueData = await Payment.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const avgDeliveryTime = await Booking.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      {
        $project: {
          deliveryTime: { $divide: [{ $subtract: ['$delivery.estimatedDate', '$pickup.date'] }, 1000 * 60 * 60 * 24] }
        }
      },
      { $group: { _id: null, avgTime: { $avg: '$deliveryTime' } } }
    ]);

    const activeDisputes = await Complaint.countDocuments({ status: { $in: ['open', 'in_progress', 'escalated'] } });

    res.status(200).json({
      success: true,
      data: {
        totalShipments,
        totalRevenue,
        avgDeliveryTime: avgDeliveryTime.length > 0 ? avgDeliveryTime[0].avgTime : 0,
        activeDisputes
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

