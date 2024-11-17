// src/routes/eventRoutes.ts

import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventsById,
  userEvents,
} from "../controllers/eventController";
import {
  createUpdateAttendy,
  getAllEventAttendy,
  getAttendy,
} from "../controllers/attendyController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/user-event", authenticateToken, userEvents);
router.get("/", getAllEvents);
router.get("/:id", getEventsById);

router.post("/", authenticateToken, createEvent);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);

// Attendy Routes
router.get("/:eventId/user-attendy", authenticateToken, getAttendy);
router.get("/:eventId/attendies", getAllEventAttendy);
router.post("/:eventId/attendies", authenticateToken, createUpdateAttendy);

export default router;
