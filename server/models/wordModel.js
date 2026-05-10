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

  createBulk: (userId, lessonId, words, callback) => {
    if (!Array.isArray(words) || words.length === 0) {
      return callback(new Error("words массив bo‘lishi va bo‘sh bo‘lmasligi kerak"));
    }

    const sql = `
      INSERT INTO words (lessonId, userId, english, uzbek, example, exampleUz, learned)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const stmt = db.prepare(sql);
      const insertedWords = [];
      let remaining = words.length;
      let finished = false;

      const doneOnce = (err, result) => {
        if (finished) return;
        finished = true;
        callback(err, result);
      };

      const rollback = (err) => {
        try {
          stmt.finalize(() => {
            db.run("ROLLBACK", () => doneOnce(err));
          });
        } catch (_) {
          db.run("ROLLBACK", () => doneOnce(err));
        }
      };

      words.forEach((word) => {
        const english = word.english;
        const uzbek = word.uzbek;
        const example = word.example ?? null;
        const exampleUz = word.exampleUz ?? null;

        stmt.run([lessonId, userId, english, uzbek, example, exampleUz], function (err) {
          if (finished) return;
          if (err) return rollback(err);

          insertedWords.push({
            id: this.lastID,
            lessonId,
            userId,
            english,
            uzbek,
            example: word.example,
            exampleUz: word.exampleUz,
            learned: 0
          });

          remaining -= 1;
          if (remaining === 0) {
            stmt.finalize((finalizeErr) => {
              if (finalizeErr) return rollback(finalizeErr);
              db.run("COMMIT", (commitErr) => {
                if (commitErr) return rollback(commitErr);
                doneOnce(null, { inserted: insertedWords.length, words: insertedWords });
              });
            });
          }
        });
      });
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
