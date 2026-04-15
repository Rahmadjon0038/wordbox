const Lesson = require('../models/lessonModel');

// User uchun barcha darslarni olish
exports.getUserLessons = (req, res) => {
  const userId = req.user.id;

  Lesson.getByUserId(userId, (err, lessons) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User lessons", lessons });
  });
};

// Yangi dars qo‘shish
exports.createLesson = (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: "Title majburiy" });

  Lesson.create(userId, title, (err, lesson) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Lesson yaratildi", lesson });
  });
};

// Darsni tahrirlash
exports.updateLesson = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, words, learned } = req.body;

  Lesson.update(id, userId, { title, words, learned }, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: "Lesson topilmadi" });
    res.json({ message: "Lesson yangilandi" });
  });
};

// Darsni o‘chirish
exports.deleteLesson = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  Lesson.delete(id, userId, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: "Lesson topilmadi" });
    res.json({ message: "Lesson o‘chirildi" });
  });
};

// User uchun barcha darslarni olish
exports.getUserLessons = (req, res) => {
  const userId = req.user.id;

  Lesson.getByUserId(userId, (err, lessons) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User lessons", lessons });
  });
};

// User umumiy statistikasi
exports.getUserStats = (req, res) => {
  const userId = req.user.id;

  Lesson.getUserStats(userId, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User umumiy statistika", stats });
  });
};


// Bitta darsni olish
exports.getLessonById = (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.id;

  Lesson.getLessonById(userId, lessonId, (err, lesson) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!lesson) return res.status(404).json({ message: "Dars topilmadi" });

    res.json({
      id: lesson.id,
      title: lesson.title
    });
  });
};