const jwt = require('jsonwebtoken');
const { secretKey } = require('./config');

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

module.exports = { generateToken, verifyToken };
