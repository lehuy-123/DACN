import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Vui lòng nhập mã khuyến mãi"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: String,
    discountPercent: {
      type: Number,
      required: [true, "Vui lòng nhập phần trăm giảm"],
      min: 1,
      max: 100,
    },
    maxDiscount: { type: Number, default: 100000 }, // Giảm tối đa
    expiredAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Promotion", promotionSchema);
