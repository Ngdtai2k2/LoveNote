const paginate = async (model, req, queryOptions = {}) => {
  const {
    page = 1,
    limit = 10,
    order = 'created_at',
    sort = 'DESC',
  } = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const offset = (pageNumber - 1) * limitNumber;

  const orderArray = [[order, sort.toUpperCase()]];

  const result = await model.findAndCountAll({
    limit: limitNumber,
    offset,
    order: orderArray,
    ...queryOptions,
  });

  const totalItems = result.count;
  const totalPages = Math.ceil(totalItems / limitNumber);
  const hasNextPage = pageNumber < totalPages;

  return {
    totalItems,
    totalPages,
    currentPage: pageNumber,
    hasNextPage,
    data: result.rows,
  };
};

module.exports = paginate;
