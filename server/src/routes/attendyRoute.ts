import express from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import {
  createUpdateAttendy,
  getAllEventAttendy,
  getAttendy,
} from "../controllers/attendyController";

const router = express.Router();

// Authenticate Route
//api/attendy
router.post("/create/:eventId", authenticateToken, createUpdateAttendy);
router.get("/get/:eventId", authenticateToken, getAttendy); // If login user give attendy previously
router.get("/getallattendy/:eventId", getAllEventAttendy);

export default router;
