import express from "express";
import {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  searchLocation,
} from "../controllers/locationController.js";

const router = express.Router();

// ➕ Thêm mới địa điểm
router.post("/", createLocation);

// 📋 Lấy danh sách tất cả địa điểm
router.get("/", getLocations);

// 🔎 Tìm kiếm địa điểm theo tên (VD: /api/locations/search?q=tan son nhat)
router.get("/search", searchLocation);

// 🔍 Lấy chi tiết 1 địa điểm theo ID
router.get("/:id", getLocation);

// ✏️ Cập nhật thông tin địa điểm
router.put("/:id", updateLocation);

// ❌ Xóa địa điểm
router.delete("/:id", deleteLocation);

export default router;
