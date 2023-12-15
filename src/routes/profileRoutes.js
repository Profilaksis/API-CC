const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getProfile , editProfile } = require('../controllers/profileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express.Router();

app.get('/profile', authenticateToken, getProfile);
app.put('/edit-profile', authenticateToken, upload.single('file'), editProfile);

module.exports = app;
