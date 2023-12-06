const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getProfile , editProfile } = require('../controllers/profileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express.Router();


//autentikasi
app.post('/register', register);
app.post('/login', login);
app.get('/logout', authenticateToken, logout);
app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

//Route Profile
app.get('/profile', authenticateToken, getProfile);
app.put('/edit-profile', authenticateToken, upload.single('file'), editProfile);

module.exports = app;
