import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // 👤 Thông tin người đặt
    userName: { type: String, required: true },
    phone: { type: String, required: true },

    // 🚍 Chuyến xe liên kết
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },

    // 🪑 Ghế đã chọn (danh sách ghế cụ thể: ["A1", "A2"])
    seats: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Phải chọn ít nhất 1 ghế!",
      },
    },

    // 💰 Tổng tiền
    totalPrice: { type: Number, required: true },

    // 📦 Trạng thái
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
