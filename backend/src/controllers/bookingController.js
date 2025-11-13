import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";

// 🟢 CREATE Booking (chọn ghế cụ thể)
export const createBooking = async (req, res) => {
  try {
    const { trip, seats, userName, phone } = req.body;

    // ✅ Validate cơ bản
    if (!trip || !seats || !userName || !phone) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
    }

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 ghế!" });
    }

    // 🔎 Kiểm tra chuyến xe
    const foundTrip = await Trip.findById(trip);
    if (!foundTrip) return res.status(404).json({ message: "Không tìm thấy chuyến xe!" });

    // ❌ Kiểm tra ghế đã đặt chưa
    const bookedSeats = foundTrip.seats.filter(
      (s) => seats.includes(s.seatNumber) && s.isBooked
    );
    if (bookedSeats.length > 0) {
      return res.status(400).json({
        message: `Ghế ${bookedSeats.map((s) => s.seatNumber).join(", ")} đã được đặt!`,
      });
    }

    // 🔒 Cập nhật ghế đã đặt
    foundTrip.seats.forEach((s) => {
      if (seats.includes(s.seatNumber)) s.isBooked = true;
    });
    await foundTrip.save();

    // 💰 Tính tiền
    const totalPrice = foundTrip.price * seats.length;

    // 🧾 Tạo booking
    const booking = await Booking.create({
      userName,
      phone,
      trip,
      seats,
      totalPrice,
    });

    res.status(201).json({
      message: "Đặt vé thành công!",
      booking,
    });
  } catch (err) {
    console.error("❌ Lỗi createBooking:", err.message);
    res.status(500).json({ message: "Lỗi khi đặt vé!", error: err.message });
  }
};

// 🟡 READ (Tất cả booking)
export const getBookings = async (_, res) => {
  try {
    const bookings = await Booking.find().populate({
      path: "trip",
      populate: { path: "from to" },
    });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách booking!", error: err.message });
  }
};

// 🟣 READ (1 booking cụ thể)
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "trip",
      populate: { path: "from to" },
    });

    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking!" });

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết booking!", error: err.message });
  }
};

// 🟠 UPDATE booking
export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy booking!" });
    res.status(200).json({ message: "Cập nhật thành công!", updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật booking!", error: err.message });
  }
};

// 🔴 DELETE booking (tự động mở lại ghế)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy booking!" });

    // 🪑 Mở lại ghế trong Trip
    const foundTrip = await Trip.findById(booking.trip);
    foundTrip.seats.forEach((seat) => {
      if (booking.seats.includes(seat.seatNumber)) seat.isBooked = false;
    });
    await foundTrip.save();

    await booking.deleteOne();

    res.status(200).json({ message: "Đã xoá booking và mở lại ghế!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá booking!", error: err.message });
  }
};

// 🔍 SEARCH booking theo tên user
export const searchBooking = async (req, res) => {
  try {
    const q = req.query.q || "";
    const results = await Booking.find({ userName: new RegExp(q, "i") }).populate({
      path: "trip",
      populate: { path: "from to" },
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm booking!", error: err.message });
  }
};

// 💰 Thanh toán giả lập
export const fakePayment = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "paid" },
      { new: true }
    ).populate({
      path: "trip",
      populate: { path: "from to" },
    });

    if (!booking) return res.status(404).json({ message: "Không tìm thấy vé để thanh toán!" });

    res.status(200).json({
      message: "Thanh toán giả lập thành công!",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thanh toán giả lập!", error: err.message });
  }
};

// 🧾 Lịch sử đặt vé
export const getBookingHistory = async (req, res) => {
  try {
    const { phone, userName } = req.query;
    const filter = {};
    if (phone) filter.phone = phone;
    if (userName) filter.userName = new RegExp(userName, "i");

    const history = await Booking.find(filter)
      .populate({
        path: "trip",
        populate: { path: "from to" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử đặt vé!", error: err.message });
  }
};
