export const paginationMiddleware = (req, res, next) => {
  let { page = 1, limit = 10, search, filterBy, filterValue, sortBy = "id", sortOrder = "ASC" } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 10; 

  req.pagination = {
    page,
    limit,
    offset: (page - 1) * limit,
    search: search ? search.trim() : null,
    filterBy: filterBy ? filterBy.trim() : null,
    filterValue: filterValue ? filterValue.trim() : null,
    sortBy: sortBy ? sortBy.trim() : null,
    sortOrder: sortOrder ? sortOrder.trim() : null,
  };

  next();
};

export const buildPagination = (count, { page, limit }) => {
  const totalPages = Math.ceil(count / limit);

  return {
    totalItems: count,
    currentPage: page,
    pageSize: limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
