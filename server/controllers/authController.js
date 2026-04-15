const User = require("../models/authModels");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔑 Access token yasash
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// 🔑 Refresh token yasash
const generateRefreshToken = (user) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
};

const getCookie = (req, name) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const c of cookies) {
    if (c.startsWith(`${name}=`)) {
      return decodeURIComponent(c.slice(name.length + 1));
    }
  }
  return null;
};

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
};

// 📌 Register
exports.register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email va password majburiy " });
  }

  const userRole = role || "user";

  User.create(name, email, password, userRole, (err, user) => {
    if (err) {
      // SQLITE constraint errorini tekshirish
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ error: "Bu email avvaldan mavjud " });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "User ro'yxatdan o'tdi ",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  });
};

// 📌 Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  //  validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email va password majburiy " });
  }

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User topilmadi " });

    // parolni tekshirish
    if (user.password !== password) {
      return res.status(401).json({ error: "Parol noto‘g‘ri " });
    }

    // access + refresh token yaratamiz
    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    User.updateRefreshToken(user.id, refreshToken, (rtErr) => {
      if (rtErr) return res.status(500).json({ error: rtErr.message });
      setRefreshCookie(res, refreshToken);

      res.json({
        message: "Login muvaffaqiyatli ",
        token,
        role: user.role,
      });
    });
  });
};

// 📌 User me (faqat token orqali)
exports.getMe = (req, res) => {
  const userId = req.user.id;

  User.getById(userId, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User topilmadi" });

    res.json({
      message: "User ma’lumotlari ",
      user,
    });
  });
};

// 📌 Barcha userlarni olish (faqat admin uchun)
exports.getAllUsers = (req, res) => {
  // faqat admin ruxsatini tekshiramiz
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Faqat admin kirishi mumkin ❌" });
  }

  User.getAll((err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Barcha foydalanuvchilar ✅",
      users,
    });
  });
};

// 📌 Refresh token
exports.refreshToken = (req, res) => {
  const refreshToken = getCookie(req, "refreshToken");
  if (!refreshToken) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: "Refresh token yo‘q" });
  }

  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch (e) {
    clearRefreshCookie(res);
    return res.status(401).json({ error: "Refresh token yaroqsiz" });
  }

  User.getByIdWithRefresh(decoded.id, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: "User topilmadi" });
    if (!user.refresh_token || user.refresh_token !== refreshToken) {
      clearRefreshCookie(res);
      return res.status(401).json({ error: "Refresh token mos emas" });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    User.updateRefreshToken(user.id, newRefreshToken, (rtErr) => {
      if (rtErr) return res.status(500).json({ error: rtErr.message });
      setRefreshCookie(res, newRefreshToken);
      res.json({ token: newAccessToken });
    });
  });
};

// 📌 Logout (refresh tokenni bekor qilish)
exports.logout = (req, res) => {
  const refreshToken = getCookie(req, "refreshToken");
  if (!refreshToken) {
    return res.status(200).json({ message: "Logout muvaffaqiyatli" });
  }

  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, secret);
  } catch (e) {
    clearRefreshCookie(res);
    return res.status(200).json({ message: "Logout muvaffaqiyatli" });
  }

  User.updateRefreshToken(decoded.id, null, (rtErr) => {
    if (rtErr) return res.status(500).json({ error: rtErr.message });
    clearRefreshCookie(res);
    res.status(200).json({ message: "Logout muvaffaqiyatli" });
  });
};
