const redisService = require('../services/redis.service');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        message: 'Authentication Required',
        code: 'AUTH_001'
      });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    const session = await redisService.validateSession(decoded.sessionId);

    if (!session) {
      return res.status(401).json({
        message: 'Invalid Session',
        code: 'AUTH_007'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('[authMiddleware][verifyToken]', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      user: req.user?.username || 'unknown'
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token Expired',
        code: 'AUTH_002'
      });
    }

    return res.status(401).json({
      message: 'Invalid Token',
      code: 'AUTH_003'
    });
  }
};


module.exports = { verifyToken };