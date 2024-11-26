import Event from "../models/Event";
import EventGenre from "../models/EventGenre";

export const createEvent = async (eventData: any) => {
  console.log("????????????????????????????>>>>>>>>>>", eventData);
  // @ts-ignore
  const { title, details, location, startDate, endDate, thumbnailUrl, genreId, userId } = eventData;
  const newEvent = await Event.create(
    {
      title,
      details,
      location,
      startDate,
      endDate,
      thumbnailUrl,
      userId,
    },
    { returning: true }
  );
  for (let i = 0; i < eventData.genreId.length; i++) {
    // @ts-ignore
    const genreid = genreId[i].value;
    EventGenre.create({
      eventId: newEvent.id,
      genreId: genreid,
    });
  }
  return newEvent;
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

export const findEvents = async (whereClause: any, limit: number, offset: number) => {
  return await Event.findAll({
    where: whereClause,
    limit,
    offset,
  });
};
