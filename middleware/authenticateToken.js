const { jwt, jwtSecret }  = require('../config.js');

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }
  
    // Check if the token starts with 'Bearer '
    if (!token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
  
    const accessToken = token.substring(7); // Remove 'Bearer ' prefix
  
    jwt.verify(accessToken, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
  }

module.exports = authenticateToken;