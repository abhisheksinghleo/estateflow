function notFound(req, res, next) {
  return res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
}

module.exports = {
  notFound,
  errorHandler
};
