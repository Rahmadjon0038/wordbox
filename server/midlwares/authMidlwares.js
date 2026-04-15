const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Token topilmadi ❌" });
  }

  const token = authHeader.split(' ')[1]; // "Bearer token" dan faqat token qismi
  if (!token) {
    return res.status(401).json({ error: "Token noto‘g‘ri formatda ❌" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token yaroqsiz ❌" });
  }
};


module.exports = authMiddleware;
