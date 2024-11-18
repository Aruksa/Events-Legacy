import { Op } from "sequelize";

export const locationFilter = (filters: any) => {
  if (filters.location) {
    return { location: { [Op.iLike]: `%${filters.location}%` } };
  }
  return {};
};
