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
    const { title, tags, content } = req.body;

    if (!title || !tags || !content) {
      return res.status(400).json({
        error: 'Judul, tags, dan content diperlukan',
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        error: 'File gambar diperlukan',
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

      const query = 'INSERT INTO articles (title, image_url, tags, content) VALUES (?, ?, ?, ?)';
      const values = [title, imageUrl, tags, content];

      db.query(query, values, (dbErr, result) => {
        if (dbErr) {
          console.error(dbErr);
          return res.status(500).json({ error: 'Terjadi kesalahan server', details: dbErr.message });
        }

        return res.status(201).json({ message: 'Artikel berhasil ditambahkan' });
      });
    });

    localReadStream.pipe(stream);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan server', details: error.message });
  }
};




const getAllArticles = (req, res) => {
  try {
    Articles.getAllArticles((err, articles) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
      return res.status(200).json(articles);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};

const getArticlesById = (req, res) => {
    try {
      const articleId = req.params.id;
  
      Articles.getArticleById(articleId, (err, article) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
  
        if (!article) {
          return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }
  
        return res.status(200).json(article);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
};

const getArticlesByTags = (req, res) => {
    try {
      const tags = req.params.tags;
  
      Articles.getArticlesByTags(tags, (err, articles) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
  
        return res.status(200).json(articles);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
};

const editArticle = async (req, res) => {
  try {
    console.log(req.file);
    const articleId = req.params.id;
    const { title, tags, content } = req.body;

    if (!title || !tags || !content) {
      return res.status(400).json({
        error: 'Judul, tags, dan content diperlukan',
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
        const updateQuery = 'UPDATE articles SET title = ?, image_url = ?, tags = ?, content = ? WHERE id = ?';
        const updateValues = [title, imageUrl, tags, content, articleId];

        db.query(updateQuery, updateValues, (updateErr, updateResult) => {
          if (updateErr) {
            console.error(updateErr);
            return res.status(500).json({ error: 'Terjadi kesalahan server' });
          }

          return res.status(200).json({ message: 'Artikel berhasil diupdate' });
        });
      });

      localReadStream.pipe(stream);
    } else {
      // Update the article without changing the image
      const updateQuery = 'UPDATE articles SET title = ?, tags = ?, content = ? WHERE id = ?';
      const updateValues = [title, tags, content, articleId];

      db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ error: 'Terjadi kesalahan server' });
        }

        return res.status(200).json({ message: 'Artikel berhasil diupdate' });
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
const deleteArticle = (req, res) => {
    try {
      const articleId = req.params.id;
  
      Articles.deleteArticle(articleId, (err, result) => {
        if (err) {
          console.error('Error deleting article:', err);
          return res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
  
        if (!result) {
          return res.status(404).json({ error: 'Artikel tidak ditemukan' });
        }
  
        return res.status(200).json({ message: 'Artikel berhasil dihapus' });
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
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
