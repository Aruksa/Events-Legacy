// src/routes/eventRoutes.ts

import express from "express";
import { createEvent, updateEvent, deleteEvent, getAllEvents, getEventsById, userEvents, searchEvent } from "../controllers/eventController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventsById);

router.post("/", authenticateToken, createEvent);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);
router.get("/user-event", authenticateToken, userEvents);

export default router;
