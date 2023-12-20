const { User } = require('../models/User');
const { generateToken, verifyToken } = require('../utils/jwt');
const db = require('../database/db');

const blacklistedTokens = new Set();

async function register(req, res) {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and password confirmation do not match' });
  }

  try {
    // cek username dan email
    const checkUserQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
    const checkUserValues = [username, email];

    db.query(checkUserQuery, checkUserValues, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Username or email is already in use' });
      }

      // jika tidak ada yang sama
      const user = new User(username, email, password);
      user.save();

      const token = generateToken({ username, email });

      res.status(201).json({ message: 'Registration successful'});
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function login(req, res) {
  const { username, password } = req.body;

  const query = 'SELECT id,username,email,role,photo_url FROM users WHERE username = ? AND password = ?';
  const values = [username, password];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const user = results[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = generateToken({ username: user.username, email: user.email });

    // Include the token directly in the data field with double quotes
    res.status(200).json({ 
      message: 'Login successful',  
      data: { 
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.photo_url,
        token: token,
      },
    });
  });
}


function logout(req, res) {
  const token = req.header('Authorization');

  // Verifikasi dan blacklist token yang telah di log
  try {
    if (!token) {
      blacklistedTokens.add(token); 
      console.log('Token not provided, but blacklisted successfully');
      return res.status(200).json({ message: 'Logout successful' });
    }

    console.log('Verifying token:', token);
    const decodedToken = verifyToken(token);

    if (blacklistedTokens.has(token)) {
      return res.status(401).json({ message: 'Token has already been blacklisted' });
    }

    blacklistedTokens.add(token); 
    console.log('Logout Request Received for:', decodedToken.username);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { register, login, logout, blacklistedTokens };
