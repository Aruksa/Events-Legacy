// src/routes/eventRoutes.ts

import express from "express";
import { createEvent, updateEvent, deleteEvent, getAllEvents, getEventById, userEvents } from "../controllers/eventController";
import { createUpdateAttendy, getAllEventAttendy, getAttendy } from "../controllers/attendyController";
import { authenticateToken } from "../middleware/authMiddleware";
import { trackUserVisit } from "../middleware/trackUserMiddleware";

const router = express.Router();

router.get("/user-event", authenticateToken, userEvents);
router.get("/", getAllEvents);
router.get("/:id", trackUserVisit, getEventById);

router.post("/", authenticateToken, createEvent);
router.put("/:id", authenticateToken, updateEvent);
router.delete("/:id", authenticateToken, deleteEvent);

// Attendy Routes
router.get("/:eventId/user-attendy", authenticateToken, getAttendy);
router.get("/:eventId/attendies", getAllEventAttendy);
router.post("/:eventId/attendies", authenticateToken, createUpdateAttendy);

export default router;
