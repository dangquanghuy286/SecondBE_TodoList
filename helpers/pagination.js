module.exports = (objectPagination, query, countRecords) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  if (query.limit) {
    objectPagination.limit = parseInt(query.limit);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limit;

  const totalPage = Math.ceil(countRecords / objectPagination.limit);

  objectPagination.totalPage = totalPage;
  return objectPagination;
};
