import express from "express";
import { getSummaryReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", getSummaryReport);

export default router;
