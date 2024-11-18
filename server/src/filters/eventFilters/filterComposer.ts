import { locationFilter } from "./locationFilter";
import { titleFilter } from "./titlefilter";

export const composeFilters = (filters: any) => {
  const filterFunctions = [titleFilter, locationFilter];
  return filterFunctions.reduce((acc, filterFunc) => {
    return { ...acc, ...filterFunc(filters) };
  }, {});
};
