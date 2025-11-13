import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";

export const getSummaryReport = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const cancelledTrips = await Trip.countDocuments({ status: "cancelled" });

    res.json({
      success: true,
      data: {
        totalBookings,
        totalTrips,
        totalRevenue: totalRevenue[0]?.total || 0,
        cancelRate: totalTrips > 0 ? (cancelledTrips / totalTrips) * 100 : 0,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
