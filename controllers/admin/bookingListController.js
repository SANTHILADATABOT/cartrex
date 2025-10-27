const Booking = require('../../models/Booking');
const mongoose = require('mongoose');

// ✅ GET all bookings (only active ones)
exports.getallbookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ deletstatus: 0 })
       .populate('shipperId', 'companyName name email')
       .populate('carrierId', 'companyName name email');
      // .populate('truckId', 'nickname registrationNumber')
      // .populate('createdBy', 'name email')
      // .populate('updatedBy', 'name email')
      // .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      message: "Bookings fetched successfully",
      data: bookings
    });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ UPDATE booking
exports.updatebooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({ _id: bookingId, deletstatus: 0 });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found or deleted" });
    }

    // Apply updates safely
    Object.keys(updateData).forEach(f => {
      if (updateData[f] !== undefined) booking[f] = updateData[f];
    });

    // Update tracking fields
    booking.updatedAt = new Date();
    booking.updatedBy = req.user?._id || null; // Optional, based on login

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking
    });

  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// ✅ SOFT DELETE booking (set deletstatus = 1)
exports.deletebooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    const booking = await Booking.findOne({ _id: bookingId, deletstatus: 0 });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found or already deleted" });
    }

    booking.deletstatus = 1;
    booking.deletedAt = new Date();
    booking.deletedBy = req.user?._id || null;
    booking.deletedipAddress = req.ip;

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: booking
    });

  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
