import express from "express";
import {
  createPromotion,
  getPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion,
  searchPromotion,
} from "../controllers/promotionController.js";

const router = express.Router();

// 🔎 Tìm kiếm trước để tránh xung đột /:id
router.get("/search/query", searchPromotion);

// CRUD
router.post("/", createPromotion);
router.get("/", getPromotions);
router.get("/:id", getPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
