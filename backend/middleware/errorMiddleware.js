const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  return res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
