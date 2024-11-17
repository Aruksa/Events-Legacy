import { Request, RequestHandler, Response } from "express";
import * as eventService from "../services/eventService";
import Event from "../models/Event";
import { EventGenre } from "../models";
import { Op } from "sequelize";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const eventData = { ...req.body, userId };
    const newEvent = await eventService.createEvent(eventData);
    res.status(201).json({ message: "Event created successfully", data: newEvent });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const updatedEvent = await eventService.updateEvent(parseInt(id), userId, req.body);
    res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    await eventService.deleteEvent(parseInt(id), userId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 10, title, location } = req.query;
    const filters = { title, location };
    const events = await eventService.getEvents(filters, parseInt(page as string), parseInt(pageSize as string));
    res.status(200).json({ data: events });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(parseInt(id));
    res.status(200).json({ data: event });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const userEvents: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user?.id;

  try {
    const event = await Event.findAll({ where: { userId } });

    if (!event) {
      res.status(404).json({ message: "Event not found or unauthorized" });
      return;
    }

    res.status(200).json({ data: event });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error });
    return;
  }
};
