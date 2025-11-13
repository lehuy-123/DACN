import express from "express";
import { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle, searchVehicle } from "../controllers/adminController.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);
router.post("/search", searchVehicle);

export default router; 
