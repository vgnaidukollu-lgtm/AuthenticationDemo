require('dotenv').config();

module.exports = {
  // Server configuration
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Security
  JWT_SECRET: 'your-secret-key-here',  // Fixed secret for development
  SESSION_SECRET: 'session-secret-key', // Fixed secret for development
  COOKIE_SECRET: 'cookie-secret-key',   // Fixed secret for development

  // Redis configuration for sessions
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Security settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per window

  // Cookie settings
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
};

// Throw error if required production configs are missing
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET must be set in production');
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET must be set in production');
  if (!process.env.COOKIE_SECRET) throw new Error('COOKIE_SECRET must be set in production');
}