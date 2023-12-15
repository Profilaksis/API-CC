const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const articlesRoutes = require('./routes/articlesRoutes');
const tfjsRoutes = require('./routes/tfjsRoutes');
const historyRoutes = require('./routes/historyRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Middleware
// Middleware
app.use(express.static('src/tfjs'));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/articles', articlesRoutes);
app.use('/prediksi', tfjsRoutes);
app.use('/history', historyRoutes);
app.use('/', profileRoutes);

// Port configuration for Google Cloud Run
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

