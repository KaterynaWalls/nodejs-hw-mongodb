export const calcPaginationData = ({ totalItems, page, perPage }) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page !== 1;
  const hasNextPage = Boolean(totalPages - page);

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};