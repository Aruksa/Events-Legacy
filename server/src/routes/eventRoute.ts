// src/routes/eventRoutes.ts

import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventsById,
  userEvents,
  searchEvent,
} from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// Public route to get all events
router.get("/all", getAllEvents);
router.get("/get/:id", getEventsById);
router.get("/searchtitle", searchEvent);

// Protected routes for authenticated users
router.post("/create", authenticateToken, createEvent);
router.put("/update/:id", authenticateToken, updateEvent);
router.delete("/delete/:id", authenticateToken, deleteEvent);
router.get("/userevent", authenticateToken, userEvents);

export default router;
