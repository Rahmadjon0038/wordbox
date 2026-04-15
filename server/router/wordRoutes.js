const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const authMiddleware = require('../midlwares/authMidlwares');

// Yangi so‘z qo‘shish
router.post('/:lessonId', authMiddleware, wordController.createWord);

// Darsdagi barcha so‘zlar
router.get('/:lessonId', authMiddleware, wordController.getLessonWords);

// So‘zni yangilash
router.put('/:id', authMiddleware, wordController.updateWord);

// PATCH faqat learned uchun
router.patch('/:id/learned', authMiddleware, wordController.updateWordLearned);

// So‘zni o‘chirish
router.delete('/:id', authMiddleware, wordController.deleteWord);

router.get("/lesson/:lessonId", authMiddleware, wordController.getWordsByLesson);

// Yodlay olmaganlari o‘chirish
router.get('/:lessonId/unlearned', authMiddleware, wordController.getUnlearnedWords);


module.exports = router;
