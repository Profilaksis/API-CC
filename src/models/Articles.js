const db = require('../database/db');

class Article {
  constructor(title, image_url, tags, content) {
      this.title = title;
      this.image_url = image_url;
      this.tags = tags;
      this.content = content;
  }

  static getAllArticles(callback) {
      const query = 'SELECT * FROM articles';
      db.query(query, (err, results) => {
          if (err) {
              return callback(err, null);
          }
          return callback(null, results);
      });
  }

  static getArticleById(articleId, callback) {
      const query = 'SELECT * FROM articles WHERE id = ?';
      db.query(query, [articleId], (err, results) => {
          if (err) {
              return callback(err, null);
          }
          return callback(null, results[0]);
      });
  }

  static getArticlesByTags(tags, callback) {
      const query = 'SELECT * FROM articles WHERE tags LIKE ?';
      const values = [`%${tags}%`];

      db.query(query, values, (err, results) => {
          if (err) {
              return callback(err, null);
          }
          return callback(null, results);
      });
  }

  static editArticle(articleId, title, image_url, tags, content, callback) {
      const query = 'UPDATE articles SET title = ?, image_url = ?, tags = ?, content = ? WHERE id = ?';
      const values = [title, image_url, tags, content, articleId];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error('Error updating article:', err);
              return callback(err, null);
          }
          return callback(null, result);
      });
  }

  static deleteArticle(articleId, callback) {
      const query = 'DELETE FROM articles WHERE id = ?';
      const values = [articleId];

      db.query(query, values, (err, result) => {
          if (err) {
              console.error('Error deleting article:', err);
              return callback(err, null);
          }
          return callback(null, result);
      });
  }
}

module.exports = Article;
