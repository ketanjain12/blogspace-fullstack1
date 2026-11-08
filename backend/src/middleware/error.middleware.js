exports.notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

exports.errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  // MySQL duplicate-key errors are client conflicts, not server failures.
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with these details already exists.',
    });
  }

  const statusCode = Number.isInteger(error.status) ? error.status : 500;
  const safeMessage = statusCode >= 500
    ? 'An unexpected server error occurred.'
    : error.message;

  if (statusCode >= 500) {
    console.error('[API_ERROR]', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      path: req.originalUrl,
      method: req.method,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
  });
};
