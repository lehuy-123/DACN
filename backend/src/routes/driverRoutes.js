import express from "express";
import { createDriver, getDrivers, assignDriver } from "../controllers/driverController.js";
const router = express.Router();

router.post("/", createDriver);
router.get("/", getDrivers);
router.put("/assign/:tripId", assignDriver);

export default router;
