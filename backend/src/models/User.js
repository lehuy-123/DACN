import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ⚙️ Định nghĩa Schema người dùng
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email là bắt buộc"],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// 🧩 Mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🧠 Phương thức kiểm tra mật khẩu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ⚙️ Bắt lỗi trùng key MongoDB (E11000)
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email đã tồn tại trong hệ thống!"));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
