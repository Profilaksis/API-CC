const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/addArticles', upload.single('image'), articlesController.addArticle);
router.get('/getAllArticles', articlesController.getAllArticles);
router.get('/getArticleById/:id', articlesController.getArticlesById);
router.get('/getArticlesByTags/:tags', articlesController.getArticlesByTags);
router.put('/editArticle/:id', upload.single('image'), articlesController.editArticle);
router.delete('/deleteArticle/:id', articlesController.deleteArticle);

module.exports = router;
