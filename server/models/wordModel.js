const db = require('../config/db');

// Jadval yaratish
const wordsTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lessonId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      english TEXT NOT NULL,
      uzbek TEXT NOT NULL,
      example TEXT,
      exampleUz TEXT,
      learned INTEGER DEFAULT 0,
      FOREIGN KEY(lessonId) REFERENCES lessons(id),
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error("Words jadvali yaratilmadi ❌:", err.message);
    } else {
      console.log("Words jadvali yaratildi ✅");
    }
  });
};

const Word = {
  create: (userId, lessonId, word, callback) => {
    const { english, uzbek, example, exampleUz } = word;
    const sql = `
      INSERT INTO words (lessonId, userId, english, uzbek, example, exampleUz, learned)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    db.run(sql, [lessonId, userId, english, uzbek, example, exampleUz], function (err) {
      callback(err, { id: this.lastID, lessonId, userId, ...word, learned: 0 });
    });
  },

  getByLessonId: (lessonId, userId, callback) => {
    const sql = `SELECT * FROM words WHERE lessonId = ? AND userId = ?`;
    db.all(sql, [lessonId, userId], (err, rows) => {
      callback(err, rows);
    });
  },

  update: (id, userId, data, callback) => {
    const { english, uzbek, example, exampleUz, learned } = data;
    const sql = `
      UPDATE words 
      SET english = ?, uzbek = ?, example = ?, exampleUz = ?, learned = ? 
      WHERE id = ? AND userId = ?
    `;
    db.run(sql, [english, uzbek, example, exampleUz, learned, id, userId], function (err) {
      callback(err, this.changes);
    });
  },

  updateLearned: (id, userId, learned, callback) => {
    const sql = `UPDATE words SET learned = ? WHERE id = ? AND userId = ?`;
    db.run(sql, [learned, id, userId], function (err) {
      callback(err, this.changes);
    });
  },

  delete: (id, userId, callback) => {
    const sql = `DELETE FROM words WHERE id = ? AND userId = ?`;
    db.run(sql, [id, userId], function (err) {
      callback(err, this.changes);
    });
  },

  getUnlearnedByLessonId: (lessonId, userId, callback) => {
    const sql = `SELECT id, english AS en, uzbek AS uz FROM words WHERE lessonId = ? AND userId = ? AND learned = 0`;
    db.all(sql, [lessonId, userId], (err, rows) => {
      callback(err, rows);
    });
  },



};

wordsTable();
module.exports = Word;
