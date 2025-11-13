import Trip from "../models/Trip.js";

// ➕ Tạo chuyến xe mới (auto generate ghế A1–D10)
export const createTrip = async (req, res) => {
  try {
    const { from, to, price, vehicleType, departureTime, arrivalTime, busInfo } = req.body;

    // Validate bắt buộc
    if (!from || !to || !price || !vehicleType || !departureTime) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết để tạo chuyến!" });
    }

    // 🪑 Sinh ghế mặc định: 4 hàng, mỗi hàng 10 ghế
    const seats = [];
    const rows = ["A", "B", "C", "D"];
    for (const row of rows) {
      for (let i = 1; i <= 10; i++) {
        seats.push({ seatNumber: `${row}${i}`, isBooked: false });
      }
    }

    const trip = await Trip.create({
      from,
      to,
      price,
      vehicleType,
      departureTime,
      arrivalTime,
      busInfo,
      seats,
    });

    res.status(201).json({ message: "Tạo chuyến xe thành công!", trip });
  } catch (err) {
    console.error("❌ Lỗi tạo chuyến xe:", err.message);
    res.status(500).json({ message: "Lỗi khi tạo chuyến xe!", error: err.message });
  }
};

// 📋 Lấy danh sách chuyến xe (phân trang & lọc)
export const getTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, from, to } = req.query;
    const filter = {};
    if (from) filter.from = from;
    if (to) filter.to = to;

    const trips = await Trip.find(filter)
      .populate("from to")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ departureTime: 1 });

    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách chuyến xe!", error: err.message });
  }
};

// 🔍 Lấy chi tiết chuyến xe (hiển thị cả seat map)
export const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("from to");
    if (!trip) return res.status(404).json({ message: "Không tìm thấy chuyến xe!" });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết chuyến xe!" });
  }
};

// ✏️ Cập nhật chuyến xe
export const updateTrip = async (req, res) => {
  try {
    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy chuyến xe để cập nhật!" });
    res.status(200).json({ message: "Cập nhật thành công!", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật chuyến xe!" });
  }
};

// ❌ Xoá chuyến xe
export const deleteTrip = async (req, res) => {
  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy chuyến xe để xoá!" });
    res.status(200).json({ message: "Đã xoá chuyến xe thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xoá chuyến xe!" });
  }
};

// 🔎 Tìm kiếm chuyến xe theo điểm đi / điểm đến
export const searchTrip = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from) filter.from = from;
    if (to) filter.to = to;

    const trips = await Trip.find(filter).populate("from to");
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tìm kiếm chuyến xe!", error: err.message });
  }
};
