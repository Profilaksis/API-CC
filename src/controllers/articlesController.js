const { Storage } = require('@google-cloud/storage');
const db = require('../database/db');
const Articles = require('../models/Articles');

const storage = new Storage({
  projectId: 'profilaksis-capstone',
  keyFilename: './src/controllers/key.json',
});
const bucket = storage.bucket('profilaksis-test');

const addArticle = async (req, res) => {
  try {
    const { title, tags, content, source_url } = req.body;

    if (!title || !tags || !content) {
      return res.status(400).json({
        error: 'Title, tags, and content are required',
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        error: 'Image file is required',
      });
    }

    const { originalname } = req.file;
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
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${originalname}`;

      const query = 'INSERT INTO articles (title, image_url, tags, content, source_url) VALUES (?, ?, ?, ?, ?)';
      const values = [title, imageUrl, tags, content, source_url];

      db.query(query, values, (dbErr, result) => {
        if (dbErr) {
          console.error(dbErr);
          return res.status(500).json({ error: 'Server error', details: dbErr.message });
        }

        return res.status(201).json({ message: 'Article added successfully' });
      });
    });

    localReadStream.pipe(stream);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};

const getAllArticles = (req, res) => {
  try {
    Articles.getAllArticles((err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
      return res.status(200).json({ message: 'Articles retrieved successfully', data: articles });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};


const getArticlesById = (req, res) => {
  try {
    const articleId = req.params.id;

    Articles.getArticleById(articleId, (err, article) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      return res.status(200).json({ message: 'Get Srticle by id successfully', data: article });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getArticlesByTags = (req, res) => {
  try {
    const tags = req.params.tags;

    Articles.getArticlesByTags(tags, (err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }

      return res.status(200).json({ message: 'Get Srticle by tags successfully', data: articles });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const editArticle = async (req, res) => {
  try {
    console.log(req.file);
    const articleId = req.params.id;
    const { title, tags, content, source_url } = req.body;

    if (!title || !tags || !content) {
      return res.status(400).json({
        error: 'Title, tags, and content are required',
      });
    }

    const image = req.file;

    // Check if an image is provided
    if (image) {
      const { originalname } = image;
      const localReadStream = require('fs').createReadStream(image.path);
      const fileUpload = bucket.file(originalname);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
      });

      stream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${originalname}`;

        // Update the article with the new image URL
        const updateQuery = 'UPDATE articles SET title = ?, image_url = ?, tags = ?, content = ?, source_url = ? WHERE id = ?';
        const updateValues = [title, imageUrl, tags, content, source_url, articleId];

        db.query(updateQuery, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: 'Server error' });
          }

          return res.status(200).json({ message: 'Article updated successfully' });
        });
      });

      localReadStream.pipe(stream);
    } else {
      // Update the article without changing the image
      const updateQuery = 'UPDATE articles SET title = ?, tags = ?, content = ?, source_url = ? WHERE id = ?';
      const updateValues = [title, tags, content, source_url, articleId];

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Server error' });
        }

        return res.status(200).json({ message: 'Article updated successfully' });
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const deleteArticle = (req, res) => {
  try {
    const articleId = req.params.id;

    Articles.deleteArticle(articleId, (err, result) => {
      if (err) {
        console.error('Error deleting article:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      if (!result) {
        return res.status(404).json({ error: 'Article not found', message: 'Article not found with the provided ID' });
      } else {
        return res.status(200).json({ message: 'Article deleted successfully' });
      }
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addArticle,
  getAllArticles,
  getArticlesById,
  getArticlesByTags,
  editArticle,
  deleteArticle,
};
