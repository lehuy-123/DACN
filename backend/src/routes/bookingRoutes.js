import express from "express";
import {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  searchBooking,
  fakePayment,
  getBookingHistory,
} from "../controllers/bookingController.js";

const router = express.Router();

// Lịch sử đặt vé (lọc theo tên hoặc số điện thoại)
router.get("/history", getBookingHistory);

// 🔎 Tìm kiếm booking theo tên người dùng
router.get("/search/query", searchBooking);

// 💰 Thanh toán giả lập
router.put("/pay/:id", fakePayment);

// CRUD Booking cơ bản
router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
