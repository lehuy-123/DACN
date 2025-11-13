import express from "express";
import {
  createTrip,
  getTrips,
  getTrip,
  updateTrip,
  deleteTrip,
  searchTrip,
} from "../controllers/tripController.js";

const router = express.Router();

// ➕ Tạo chuyến xe mới
router.post("/", createTrip);

// 🔎 Tìm kiếm chuyến xe (lọc theo from/to ID)
// VD: /api/trips/search?from=67300b2e9c1...&to=67300f7a9b2...
router.get("/search", searchTrip);

// 📋 Lấy danh sách chuyến xe (có phân trang)
// VD: /api/trips?page=1&limit=10
router.get("/", getTrips);

// 🔍 Lấy chi tiết chuyến xe theo ID
router.get("/:id", getTrip);

// ✏️ Cập nhật chuyến xe
router.put("/:id", updateTrip);

// ❌ Xóa chuyến xe
router.delete("/:id", deleteTrip);

export default router;
