// controllers/bookingController.js
const Booking = require('../models/Booking');
const Space = require('../models/Space');
const Shipper = require('../models/Shipper');
const Carrier = require('../models/Carrier');
const User = require('../models/User')
const { v4: uuidv4 } = require('uuid');

exports.createBooking = async (req, res) => {
  try {
    const {
      spaceId,
      vehicle,
      pickup,
      delivery,
      pricing
    } = req.body;

    const shipper = await Shipper.findOne({ userId: req.user._id });

    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ success: false, message: 'Space not found' });
    }

    if (space.availableSpaces <= space.bookedSpaces) {
      return res.status(400).json({ success: false, message: 'No spaces available' });
    }

    const bookingId = `BK-${uuidv4().substring(0, 8).toUpperCase()}`;

    const booking = await Booking.create({
      bookingId,
      shipperId: shipper._id,
      carrierId: space.carrierId,
      truckId: space.truckId,
      spaceId: space._id,
      vehicle,
      pickup,
      delivery,
      pricing,
      status: 'pending',
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Booking created'
      }]
    });

    space.bookedSpaces += 1;
    if (space.bookedSpaces >= space.availableSpaces) {
      space.status = 'booked';
    }
    await space.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (req.user.role === 'carrier') {
      const carrier = await Carrier.findOne({ userId: req.user._id });
      query.carrierId = carrier._id;
    } else if (req.user.role === 'shipper') {
      const shipper = await Shipper.findOne({ userId: req.user._id });
      query.shipperId = shipper._id;
    }
    
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('shipperId')
      .populate('carrierId')
      .populate('truckId')
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

// exports.getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('shipperId')
//       .populate('carrierId')
//       .populate('truckId')
//       .populate('spaceId');

//     if (!booking) {
//       return res.status(404).json({ success: false, message: 'Booking not found' });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking
//     });
//   } catch (error) {
//     console.error('Get booking error:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };



exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the booking and populate basic references
    const booking = await Booking.findOne({ _id: id })
      .populate("truckId")
      .populate("spaceId")
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Fetch Shipper and Carrier details (linked to User)
    let shipperDetails = null;
    let carrierDetails = null;

    if (booking.shipperId) {
      shipperDetails = await Shipper.findById(booking.shipperId)
        .populate("userId", "firstName lastName email phone role")
        .lean();
    }

    if (booking.carrierId) {
      carrierDetails = await Carrier.findById(booking.carrierId)
        .populate("userId", "firstName lastName email phone role")
        .lean();
    }

    // Construct response object with names & emails
    const bookingWithExtras = {
      ...booking.toObject(),
      shipperName: shipperDetails?.userId
        ? `${shipperDetails.userId.firstName} ${shipperDetails.userId.lastName || ""}`.trim()
        : null,
      shipperEmail: shipperDetails?.userId?.email || null,
      carrierName: carrierDetails?.userId
        ? `${carrierDetails.userId.firstName} ${carrierDetails.userId.lastName || ""}`.trim()
        : null,
      carrierEmail: carrierDetails?.userId?.email || null,
    };

    res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      data: bookingWithExtras,
    });
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



exports.acceptBooking = async (req, res) => {
  try {
    const { carrierMessage, truckId, additionalFee, confirmPickupDate, estimatedDeliveryDate } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'accepted';
    booking.carrierMessage = carrierMessage;
    if (truckId) booking.truckId = truckId;
    if (additionalFee) booking.pricing.additionalFee = additionalFee;
    if (confirmPickupDate) booking.pickup.date = confirmPickupDate;
    if (estimatedDeliveryDate) booking.delivery.estimatedDate = estimatedDeliveryDate;
    
    booking.timeline.push({
      status: 'accepted',
      timestamp: new Date(),
      note: 'Booking accepted by carrier'
    });

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: `Cancelled: ${cancellationReason}`
    });

    await booking.save();

    const space = await Space.findById(booking.spaceId);
    if (space) {
      space.bookedSpaces = Math.max(0, space.bookedSpaces - 1);
      space.status = 'active';
      await space.save();
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note, deliveryPhotos } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    if (deliveryPhotos) booking.deliveryPhotos = deliveryPhotos;
    
    booking.timeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`
    });

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
