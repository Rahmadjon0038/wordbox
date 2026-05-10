const Word = require('../models/wordModel');
const Lesson = require('../models/lessonModel');

// Yangi so‘z qo‘shish
exports.createWord = (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;
  const { english, uzbek, example, exampleUz } = req.body;

  if (!english || !uzbek) {
    return res.status(400).json({ error: "English va Uzbek majburiy" });
  }

  Word.create(userId, lessonId, { english, uzbek, example, exampleUz }, (err, word) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "So‘z qo‘shildi", word });
  });
};

// Bulk so‘zlar qo‘shish
exports.createWordsBulk = (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;
  const { words } = req.body;

  const parsedLessonId = Number.parseInt(lessonId, 10);
  if (!Number.isFinite(parsedLessonId)) {
    return res.status(400).json({ error: "lessonId noto‘g‘ri" });
  }

  if (!Array.isArray(words)) {
    return res.status(400).json({ error: "`words` массив bo‘lishi kerak" });
  }
  if (words.length === 0) {
    return res.status(400).json({ error: "`words` bo‘sh bo‘lmasin" });
  }
  if (words.length > 1000) {
    return res.status(400).json({ error: "`words` maksimum 1000 ta bo‘lishi mumkin" });
  }

  const errors = [];
  const normalized = words.map((w, index) => {
    const english = typeof w?.english === "string" ? w.english.trim() : "";
    const uzbek = typeof w?.uzbek === "string" ? w.uzbek.trim() : "";
    const example = typeof w?.example === "string" ? w.example : undefined;
    const exampleUz = typeof w?.exampleUz === "string" ? w.exampleUz : undefined;

    if (!english) errors.push({ index, field: "english", message: "Majburiy" });
    if (!uzbek) errors.push({ index, field: "uzbek", message: "Majburiy" });

    return { english, uzbek, example, exampleUz };
  });

  if (errors.length) {
    return res.status(400).json({ error: "Validatsiya xatosi", errors });
  }

  // Dars userga tegishli ekanligini tekshiramiz
  Lesson.getById(parsedLessonId, userId, (err, lesson) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!lesson) return res.status(404).json({ error: "Dars topilmadi" });

    Word.createBulk(userId, parsedLessonId, normalized, (bulkErr, result) => {
      if (bulkErr) return res.status(500).json({ error: bulkErr.message });
      res.status(201).json({
        message: "So‘zlar qo‘shildi",
        lessonId: parsedLessonId,
        inserted: result.inserted,
        words: result.words
      });
    });
  });
};

// Darsdagi so‘zlarni olish
exports.getLessonWords = (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;

  Word.getByLessonId(lessonId, userId, (err, words) => {
    if (err) return res.status(500).json({ error: err.message });
    // Tartib raqamini qo'shamiz
    const formatted = words.map((w, i) => ({
      ...w,
      order: i + 1
    }));
    res.json({ message: "Dars so‘zlari", words: formatted });
  });
};

// So‘zni yangilash
exports.updateWord = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { english, uzbek, example, exampleUz, learned } = req.body;

  Word.update(id, userId, { english, uzbek, example, exampleUz, learned }, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: "So‘z topilmadi" });
    res.json({ message: "So‘z yangilandi" });
  });
};


// Faqat learned ni yangilash
exports.updateWordLearned = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { learned } = req.body;

  Word.updateLearned(id, userId, learned, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: "So‘z topilmadi" });
    res.json({ message: "So‘z learned statusi yangilandi" });
  });
};


// So‘zni o‘chirish
exports.deleteWord = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  Word.delete(id, userId, (err, changes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (changes === 0) return res.status(404).json({ error: "So‘z topilmadi" });
    res.json({ message: "So‘z o‘chirildi" });
  });
};


exports.getWordsByLesson = (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;

  Word.getByLessonId(lessonId, userId, (err, words) => {
    if (err) return res.status(500).json({ error: err.message });

    // frontendga kerakli formatda va tartib raqami bilan qaytaramiz
    const formatted = words.map((w, i) => ({
      id: w.id,
      en: w.english,
      uz: w.uzbek,
      learned: w.learned, // 0 yoki 1
      order: i + 1
    }));

    res.json({ words: formatted });
  });
};

// Yodlanmagan so‘zlarni olish
exports.getUnlearnedWords = (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;

  Word.getUnlearnedByLessonId(lessonId, userId, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Tartib raqamini qo'shamiz
    const formatted = rows.map((w, i) => ({
      ...w,
      order: i + 1
    }));
    res.json(formatted); 
  });
};
