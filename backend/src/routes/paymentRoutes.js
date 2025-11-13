import express from "express";
import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
  searchPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// ➕ Thêm thanh toán mới
router.post("/", createPayment);

// 📋 Lấy danh sách tất cả thanh toán
router.get("/", getPayments);

// 🔍 Lấy chi tiết 1 thanh toán theo ID
router.get("/:id", getPayment);

// ✏️ Cập nhật thông tin thanh toán
router.put("/:id", updatePayment);

// ❌ Xóa thanh toán
router.delete("/:id", deletePayment);

// 🔎 Tìm kiếm thanh toán theo phương thức (VD: /api/payments/search?q=Momo)
router.get("/search/query", searchPayment);

export default router;
