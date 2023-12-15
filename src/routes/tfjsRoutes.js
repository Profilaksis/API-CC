// routes/tfjsRoutes.js

const express = require('express');
const tfjsController = require('../controllers/tfjsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Define routes for TensorFlow.js
router.post('/jantung',authenticateToken, tfjsController.predictHeartDisease);
router.post('/diabetes',authenticateToken, tfjsController.predictDiabetesDisease);


module.exports = router;
