const paginationMiddleware = (req, res, next) => {
  let pageSize = 6;
  const pageNumber = req.query.page || 1;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  req.pagination = { 
    page: pageNumber,
    limit: pageSize,
    startIndex,
    endIndex,
  };

  next();
};

module.exports = paginationMiddleware;
