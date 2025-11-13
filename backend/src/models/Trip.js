import mongoose from "mongoose";

// 🪑 Schema cho từng ghế ngồi
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // Ví dụ: A1, B3
  isBooked: { type: Boolean, default: false },
});

const tripSchema = new mongoose.Schema(
  {
    // 📍 Điểm khởi hành
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    // 📍 Điểm đến
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    // 💰 Giá vé
    price: {
      type: Number,
      required: [true, "Giá vé là bắt buộc"],
      min: [0, "Giá vé không hợp lệ"],
    },

    // 🚍 Loại phương tiện
    vehicleType: {
      type: String,
      enum: ["bus", "limousine", "minivan", "other"],
      default: "bus",
      required: true,
    },

    // ⏰ Giờ khởi hành & giờ đến
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date },

    // 🪑 Danh sách ghế
    seats: {
      type: [seatSchema],
      default: [],
    },

    // 🚘 Thông tin xe
    busInfo: {
      plateNumber: String,
      driverName: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
