import { Op } from "sequelize";
import * as eventRepository from "../repositories/eventRepository";

export const createEvent = async (data: any) => {
  const { title, details, location, startDate, endDate, thumbnailUrl, userId } = data;
  if (!title || !details || !location || !startDate || !endDate || !userId) {
    throw new Error("Missing required fields");
  }
  return await eventRepository.createEvent(data);
};

export const updateEvent = async (id: number, userId: number, data: any) => {
  const event = await eventRepository.updateEventById(id, userId, data);
  if (!event) throw new Error("Event not found or unauthorized");
  return event;
};

export const deleteEvent = async (id: number, userId: number) => {
  const success = await eventRepository.deleteEventById(id, userId);
  if (!success) throw new Error("Event not found or unauthorized");
};

export const getEvents = async (filters: any, page: number, pageSize: number) => {
  const limit = pageSize;
  const offset = (page - 1) * limit;

  const whereClause: any = {};
  if (filters.title) {
    whereClause.title = { [Op.iLike]: `%${filters.title}%` };
  }
  if (filters.location) {
    whereClause.location = { [Op.iLike]: `%${filters.location}%` };
  }

  return await eventRepository.findEvents(whereClause, limit, offset);
};

export const getEventById = async (id: number) => {
  const event = await eventRepository.findEventById(id);
  if (!event) throw new Error("Event not found");
  return event;
};
