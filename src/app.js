// app.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const articlesRoutes = require('./routes/articlesRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/articles', articlesRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
