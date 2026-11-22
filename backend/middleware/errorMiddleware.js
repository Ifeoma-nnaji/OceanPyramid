const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (res.headersSent) return next(error)

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : 'An unexpected server error occurred.',
  })
}

module.exports = errorHandler
