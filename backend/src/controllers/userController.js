import User from "../models/User.js";

// 🧾 Lấy toàn bộ danh sách người dùng (ẩn mật khẩu)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi getUsers:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng!" });
  }
};

// 👤 Lấy chi tiết 1 người dùng theo ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Lỗi getUser:", err.message);
    res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng!" });
  }
};

// ✏️ Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updated) return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
    res.status(200).json({ message: "Cập nhật thành công!", user: updated });
  } catch (err) {
    console.error("❌ Lỗi updateUser:", err.message);
    res.status(500).json({ message: "Lỗi server khi cập nhật người dùng!" });
  }
};

// 🗑️ Xoá người dùng
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy người dùng để xoá!" });
    res.status(200).json({ message: "Đã xoá người dùng thành công!" });
  } catch (err) {
    console.error("❌ Lỗi deleteUser:", err.message);
    res.status(500).json({ message: "Lỗi server khi xoá người dùng!" });
  }
};

// 🔍 Tìm kiếm người dùng theo tên hoặc email
export const searchUser = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: "Thiếu từ khoá tìm kiếm (q)!" });

    const users = await User.find({
      $or: [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Lỗi searchUser:", err.message);
    res.status(500).json({ message: "Lỗi server khi tìm kiếm người dùng!" });
  }
};
