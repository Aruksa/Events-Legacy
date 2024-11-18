import { Op } from "sequelize";

export const titleFilter = (filters: any) => {
  if (filters.title) {
    return { title: { [Op.iLike]: `%${filters.title}%` } };
  }
  return {};
};
