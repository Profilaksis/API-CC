const { verifyToken } = require('../utils/jwt');
const { blacklistedTokens } = require('../controllers/authController');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    verifyToken(token);
    const decodedToken = verifyToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
