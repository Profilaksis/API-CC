// controllers/historyController.js
const db = require('../database/db');
const { verifyToken } = require('../utils/jwt');

// Function to get health history by username
const getHistoryByUsername = (req, res) => {
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token);
    const { username } = decodedToken;

  const query = 'SELECT * FROM health_history WHERE username = ?';
  db.query(query, [username], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    return res.status(200).json({message: 'history check successfully',
    results
    });
  });
};

module.exports = {
  getHistoryByUsername,
};
