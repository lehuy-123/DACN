import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUser,
} from "../controllers/userController.js";

const router = express.Router();

// 🧾 Lấy danh sách tất cả người dùng
router.get("/", getUsers);

// 🔎 Tìm kiếm người dùng theo tên hoặc email
// VD: GET /api/users/search?q=huy
router.get("/search", searchUser);

// 👤 Lấy thông tin chi tiết của 1 user theo ID
router.get("/:id", getUser);

// ✏️ Cập nhật thông tin user
router.put("/:id", updateUser);

// ❌ Xóa user
router.delete("/:id", deleteUser);

export default router;
