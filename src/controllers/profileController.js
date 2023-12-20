const { User } = require('../models/User');
const { verifyToken } = require('../utils/jwt');
const db = require('../database/db');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');


// Inisialisasi Cloud Storage
const storage = new Storage({
  projectId: 'profilaksis-capstone',
  keyFilename: './src/controllers/key.json',
});
const bucket = storage.bucket('profilaksis-test');

async function getProfile(req, res) {
  const { username } = req.user;

  const query = 'SELECT * FROM users WHERE username = ?';
  const values = [username];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const user = results[0];

    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(
      {message: 'GET Profile successfully', 
      data: { 
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.photo_url,
      address: user.address,
      age: user.age,
      phone_number: user.phone_number,
    } });
  });
}

async function editProfile(req, res) {
  const token = req.header('Authorization');

  try {
    const decodedToken = verifyToken(token);
    const { username } = decodedToken;

    const getUserQuery = 'SELECT * FROM users WHERE username = ?';
    const getUserValues = [username];

    db.query(getUserQuery, getUserValues, async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      const user = results[0];

      if (req.file && req.file.path) {
        const { originalname } = req.file; // bukan req.photo_url
      
        const localReadStream = require('fs').createReadStream(req.file.path);

        const fileUpload = bucket.file(originalname);
        const stream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.file.mimetype,
          },
        });

        stream.on('error', (err) => {
          console.error(err);
          res.status(500).json({ error: 'Upload failed' });
        });

        stream.on('finish', async () => {
          user.photo_url = `https://storage.googleapis.com/${bucket.name}/${originalname}`;

          const updateUserQuery = `
            UPDATE users
            SET photo_url = ?
            WHERE username = ?;
          `;

          const updateUserValues = [user.photo_url, username];

          db.query(updateUserQuery, updateUserValues, (updateError) => {
            if (updateError) {
              console.error(updateError);
              return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(200).json({ message: 'Profile updated successfully' });
          });
        });

        localReadStream.pipe(stream);
      } else {
        const { address, age, phoneNumber } = req.body;
        if (address) user.address = address;
        if (age) user.age = age;
        if (phoneNumber) user.phone_number = phoneNumber;

        const updateUserQuery = `
          UPDATE users
          SET address = ?, age = ?, phone_number = ?, photo_url = ?
          WHERE username = ?;
        `;

        const updateUserValues = [user.address, user.age, user.phone_number, user.photo_url, username];

        db.query(updateUserQuery, updateUserValues, (updateError) => {
          if (updateError) {
            console.error(updateError);
            return res.status(500).json({ message: 'Internal server error' });
          }

          res.status(200).json({ message: 'Profile updated successfully' });
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { getProfile, editProfile };
