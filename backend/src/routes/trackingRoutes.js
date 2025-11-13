import express from "express";
import {
  updateVehicleLocation,
  getVehicleLocation,
  getAllVehicleLocations
} from "../controllers/trackingController.js";

const router = express.Router();

// ➕ Cập nhật vị trí
router.post("/", updateVehicleLocation);

// 🔍 Lấy vị trí của 1 xe theo biển số
router.get("/:plateNumber", getVehicleLocation);

// 📋 Danh sách tất cả xe
router.get("/", getAllVehicleLocations);

export default router;
