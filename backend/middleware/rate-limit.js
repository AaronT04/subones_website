const {RateLimiterMemory} = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 60,       // 60 requests
  duration: 60,    // per 60 seconds
});

async function applyRateLimit(req, res) {
  const ip = String((req.headers['x-forwarded-for'] || req.socket.remoteAddress || ''));

  try {
    await rateLimiter.consume(ip);
  } catch (rateLimiterRes) {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
    throw new Error('Rate limit exceeded');
  }
}

module.exports = {applyRateLimit};