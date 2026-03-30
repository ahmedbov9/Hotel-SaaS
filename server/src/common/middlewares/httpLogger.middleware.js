const logger = require('../../config/logger');

module.exports = function httpLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      userId: req.user?._id || null,
    });
  });

  next();
};