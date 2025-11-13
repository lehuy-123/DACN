import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
} from "../controllers/vehicleController.js";

const router = express.Router();

// 🚗 CRUD - 6 chức năng
router.post("/", createVehicle);           // ➕ Thêm
router.get("/", getVehicles);              // 📋 Hiển thị danh sách
router.get("/:id", getVehicle);            // 🔍 Chi tiết 1 xe
router.put("/:id", updateVehicle);         // ✏️ Sửa
router.delete("/:id", deleteVehicle);      // ❌ Xóa
router.get("/search/query", searchVehicles); // 🔎 Tìm kiếm (GET /api/vehicles/search/query?q=Ford)

export default router;
