const db = require('../config/db');

// Users jadvalini yaratish
const usersTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      role TEXT DEFAULT 'user'  -- yangi ustun
    )
  `, (err) => {
    if (err) {
      console.error("Users jadvali yaratilmadi ❌:", err.message);
    } else {
      console.log("Users jadvali yaratildi ✅");
    }
  });

  // Agar mavjud bo‘lmasa refresh_token ustunini qo‘shamiz
  db.run(`ALTER TABLE users ADD COLUMN refresh_token TEXT`, (err) => {
    if (err) {
      // duplicate column bo‘lsa e'tibor bermaymiz
      if (!String(err.message || "").includes("duplicate column")) {
        console.error("refresh_token ustuni qo‘shilmadi ❌:", err.message);
      }
    }
  });
};

const User = {
  // Register (yangi user qo‘shish)
  create: (name, email, password, role, callback) => {
    const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(sql, [name, email, password, role || 'user'], function (err) {
      callback(err, { id: this?.lastID, name, email, role: role || 'user' });
    });
  },

  // Login (email orqali userni topish)
  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      callback(err, row);
    });
  },



  // ID bo‘yicha user olish
  getById: (id, callback) => {
    const sql = `SELECT id, name, email, avatar, role FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  // ID bo‘yicha user (refresh_token bilan)
  getByIdWithRefresh: (id, callback) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  // refresh_token yangilash
  updateRefreshToken: (id, refreshToken, callback) => {
    const sql = `UPDATE users SET refresh_token = ? WHERE id = ?`;
    db.run(sql, [refreshToken, id], function (err) {
      callback(err);
    });
  },
};

usersTable(); // jadvalni yaratib qo‘yish

module.exports = User;
