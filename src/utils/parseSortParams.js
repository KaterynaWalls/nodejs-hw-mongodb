import { SORT_ORDER } from '../constants/contactTypeList.js';

export const parseSortParams = ({ sortBy, sortOrder }, SORT_BY) => {
  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];

  const parsedSortBy = SORT_BY.includes(sortBy) ? sortBy : '_id';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};