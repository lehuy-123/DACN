import express from "express";
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  searchReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// ➕ Thêm đánh giá
router.post("/", createReview);

// 📋 Hiển thị danh sách đánh giá
router.get("/", getReviews);

// 🔍 Lấy chi tiết 1 đánh giá theo ID
router.get("/:id", getReview);

// ✏️ Cập nhật đánh giá
router.put("/:id", updateReview);

// ❌ Xóa đánh giá
router.delete("/:id", deleteReview);

// 🔎 Tìm kiếm đánh giá theo tên người dùng hoặc nội dung
// VD: /api/reviews/search?q=huy
router.get("/search/query", searchReview);

export default router;
