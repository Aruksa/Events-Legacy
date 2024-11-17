import Event from "../models/Event";

export const createEvent = async (eventData: Partial<Event>) => {
  // @ts-ignore
  return await Event.create(eventData);
};

export const updateEventById = async (id: number, userId: number, updateData: Partial<Event>) => {
  return await Event.findOne({ where: { id, userId } }).then((event) => {
    if (event) return event.update(updateData);
    return null;
  });
};

export const deleteEventById = async (id: number, userId: number) => {
  return await Event.findOne({ where: { id, userId } }).then((event) => {
    if (event) {
      event.destroy();
      return true;
    }
    return false;
  });
};

export const findEventById = async (id: number) => {
  return await Event.findOne({ where: { id } });
};

export const findEvents = async (query: any, limit: number, offset: number) => {
  return await Event.findAll({
    where: query,
    limit,
    offset,
  });
};
