// db.js
const mysql = require('mysql');
const { dbConfig } = require('../utils/config');

const pool = mysql.createPool(dbConfig);

module.exports = pool;
