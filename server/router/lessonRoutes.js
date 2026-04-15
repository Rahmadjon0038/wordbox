const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../midlwares/authMidlwares');

router.get('/stats/overall', authMiddleware, lessonController.getUserStats);
// Userga mos darslar
router.get('/', authMiddleware, lessonController.getUserLessons);

// Yangi dars yaratish
router.post('/', authMiddleware, lessonController.createLesson);

// Darsni tahrirlash
router.put('/:id', authMiddleware, lessonController.updateLesson);

// Darsni o‘chirish
router.delete('/:id', authMiddleware, lessonController.deleteLesson);

// Bitta darsni olish (faqat nomi)
router.get('/:id', authMiddleware, lessonController.getLessonById);


module.exports = router;
