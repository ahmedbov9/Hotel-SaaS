const Booking = require("../bookings/booking.model");
const Guest = require("../guests/guest.model");
const Room = require("../rooms/room.model");
const RoomType = require("../room-types/room-type.model");
const Payment = require("../payments/payment.model");
const { getTodayRange } = require("./report.utils");



async function getDashboardSummary(hotelId) {
  const { start, end } = getTodayRange();

  const [
    totalBookings,
    confirmedBookings,
    cancelledBookings,
    checkedInBookings,
    totalGuests,
    totalRooms,
    totalRoomTypes,
    totalRevenueAgg,
    upcomingBookings,
    todayCheckIns,
    todayCheckOuts,
  ] = await Promise.all([
    Booking.countDocuments({ hotelId }),
    Booking.countDocuments({ hotelId, status: "confirmed" }),
    Booking.countDocuments({ hotelId, status: "cancelled" }),
    Booking.countDocuments({ hotelId, status: "checked_in" }),
    Guest.countDocuments({ hotelId }),
    Room.countDocuments({ hotelId }),
    RoomType.countDocuments({ hotelId }),
    Payment.aggregate([
      {
        $match: {
          hotelId,
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]),
    Booking.find({
      hotelId,
      status: { $in: ["pending", "confirmed"] },
      checkInDate: { $gte: start },
    })
      .sort({ checkInDate: 1 })
      .limit(5)
      .select("bookingNumber checkInDate checkOutDate status guestSnapshot roomSnapshot"),
    Booking.find({
      hotelId,
      checkInDate: { $gte: start, $lte: end },
      status: { $in: ["pending", "confirmed", "checked_in"] },
    })
      .sort({ checkInDate: 1 })
      .limit(10)
      .select("bookingNumber checkInDate status guestSnapshot roomSnapshot"),
    Booking.find({
      hotelId,
      checkOutDate: { $gte: start, $lte: end },
      status: { $in: ["checked_in", "checked_out"] },
    })
      .sort({ checkOutDate: 1 })
      .limit(10)
      .select("bookingNumber checkOutDate status guestSnapshot roomSnapshot"),
  ]);

  const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

  return {
    metrics: {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      checkedInBookings,
      totalGuests,
      totalRooms,
      totalRoomTypes,
      totalRevenue,
    },
    lists: {
      upcomingBookings,
      todayCheckIns,
      todayCheckOuts,
    },
  };
}

module.exports = {
  getDashboardSummary,
};