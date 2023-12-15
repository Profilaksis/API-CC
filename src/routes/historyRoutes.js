// routes/historyRoutes.js
const express = require('express');
const app = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getHistoryByUsername } = require('../controllers/historyController');

// Endpoint to get user health history
app.get('/cek-kesehatan', authenticateToken, getHistoryByUsername);

module.exports = app;
