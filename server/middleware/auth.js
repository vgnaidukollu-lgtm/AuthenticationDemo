const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  console.log('Auth middleware checking token...');
  
  // Get token from Authorization header
  const auth = req.headers.authorization;
  if (!auth) {
    console.log('No authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Invalid authorization format');
    return res.status(401).json({ error: 'Invalid authorization format' });
  }
  
  const token = parts[1];
  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log('Token verified, user ID:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
