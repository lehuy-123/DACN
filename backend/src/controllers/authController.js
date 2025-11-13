import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Lỗi đăng ký:", err.message);
    res.status(500).json({ message: "Lỗi server khi đăng ký!" });
  }
};


// ================= LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

    // Kiểm tra mật khẩu
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Mật khẩu không đúng!" });

    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};
