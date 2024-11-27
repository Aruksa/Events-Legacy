import { Request, RequestHandler, Response } from "express";
import * as eventService from "../services/eventService";
import Event from "../models/Event";
import { EventGenre, UserEventVisit } from "../models";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import client from "../config/elasticSearch";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const eventData = { ...req.body, userId };
    const newEvent = await eventService.createEvent(eventData);
    const genreIds = [];
    for (let i = 0; i < req.body.genreId.length; i++) {
      genreIds.push(req.body.genreId[i].value);
    }
    // Indexing games in elastic
    await client.index({
      index: "events",
      id: `${newEvent.id}`,
      body: {
        title: req.body.title,
        details: req.body.details,
        location: req.body.location,
        thumbnailUrl: req.body.thumbnailUrl,
        userId: userId,
        visit: 0,
        going: 0,
        genreId: genreIds,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
      },
    });
    res
      .status(201)
      .json({ message: "Event created successfully", data: newEvent });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const updatedEvent = await eventService.updateEvent(
      parseInt(id),
      userId,
      req.body
    );
    res
      .status(200)
      .json({ message: "Event updated successfully", data: updatedEvent });
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
    // const { page = 1, pageSize = 10, ...filters } = req.query;

    // const events = await eventService.getEvents(
    //   filters,
    //   parseInt(page as string),
    //   parseInt(pageSize as string)
    // );

    const pageES = parseInt(req.query.page as string) - 1 || 0;
    const limitES = parseInt(req.query.pageSize as string) || 10;
    const offset = pageES * limitES;
    const elasticQuery: any = {
      index: "events",
      from: offset,
      size: limitES,
      body: {
        query: {
          // Wrap bool in query
          bool: {
            must: [
              req.query.title
                ? { match_phrase_prefix: { title: req.query.title } }
                : { match_all: {} },
              req.query.location
                ? { match: { location: req.query.location } } // Fix key here
                : { match_all: {} },
            ],
          },
        },
      },
    };

    const { hits } = await client.search(elasticQuery);

    const events = hits.hits.map((hit) => {
      const source = hit._source;
      return {
        source,
        id: parseInt(hit._id!),
      };
    });
    res.status(200).json({ data: events });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || null;
    let anonId = req.cookies.anonId;

    if (!userId && !anonId) {
      anonId = uuidv4();
      res.cookie("anonId", anonId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }

    const event = await Event.findByPk(parseInt(id));

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const hasVisited = await UserEventVisit.findOne({
      where: {
        event_id: parseInt(id),
        ...(userId ? { user_id: userId } : { anon_id: anonId }),
      },
    });

    if (!hasVisited) {
      event.visits = (event.visits || 0) + 1;
      await event.save();

      await UserEventVisit.create({
        event_id: parseInt(id),
        user_id: userId,
        anon_id: anonId,
        visited_at: new Date(),
      });
    }

    res.status(200).json({ data: event });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const userEvents: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
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
