const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/authController");
const authMiddleware = require("../midlwares/authMidlwares");

const router = express.Router();

// Register va login
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refreshToken);
router.post("/logout", userController.logout);

// Yangi user/me API
router.get("/me", authMiddleware, userController.getMe);

// Yangi barcha userlarni olish admin uchun
router.get("/users", authMiddleware, userController.getAllUsers);

module.exports = router;
