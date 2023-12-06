const db = require('../database/db');

class User {
  constructor(username, email, password, photoUrl = null, address = null, age = null, phoneNumber = null) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.photoUrl = photoUrl;
    this.address = address;
    this.age = age;
    this.phoneNumber = phoneNumber;
  }

  save() {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [this.username, this.email, this.password];

      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = { User };
